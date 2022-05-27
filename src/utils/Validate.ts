import { utils } from "elmer-common";

type TypeValidateType = "String" | "Number" | "Object" | "Boolean" | "Array";

type TypeValidateSchema<ValidateCallbacks = {}> = {
    type: "String" | "Number" | "Object" | "Boolean" | "Array" | TypeValidateType[] | RegExp;
    default?: string;
    value?: string;
    format?: keyof ValidateCallbacks;
    isRequired?: boolean;
    requireMsg?: string;
    valiateMsg?: string;
};

type TypeValidateProperties<T={}, ValidateCallbacks={}> = {
    type: "Object",
    properties: { [P in keyof T]: (TypeValidateSchema<ValidateCallbacks> | TypeValidateProperties<T[P], ValidateCallbacks>) }
};

type TypeValidateConfig<T={}, ValidateCallbacks={}> = {
    properties: { [P in keyof T]: (TypeValidateSchema<ValidateCallbacks> | TypeValidateProperties<T[P], ValidateCallbacks>) }
};
type TypeValidateResult = {
    pass: boolean;
    message?: string;
};

/**
 * 校验数据
 * @param value 
 * @param validateSchema 
 * @returns 
 */
const validateByValue = <T={}, ValidateCallbacks={}>(value: any, validateSchema: TypeValidateProperties<T, ValidateCallbacks> | TypeValidateSchema<ValidateCallbacks>, validateCallbacks: any): TypeValidateResult => {
    const vResult:TypeValidateResult = { pass: true }; 
    if(!validateSchema) {
        return {
            pass: false,
            message: "数据校验失败，未定义校验规则。({{key}})"
        };
    }
    if(validateSchema.type === "Object") {
        const attrs = (validateSchema as TypeValidateProperties<any, ValidateCallbacks>).properties;
        if(attrs) {
            const keys = Object.keys(attrs);
            for(const attrKey of keys) {
                const attrValue = attrs[attrKey];
                const attrCheckValue = value ? value[attrKey] : null;
                const attrVResult = validateByValue(attrCheckValue, attrValue, validateCallbacks);
                if(!attrVResult.pass) {
                    return attrVResult;
                }
            }
        } else {
            const formatKey = (validateSchema as TypeValidateSchema).format;
            const formatFn = formatKey && !utils.isEmpty(formatKey) && validateSchema ? (validateCallbacks as any)[formatKey] : null;
            const checkValue = typeof formatFn === "function" ? formatFn(value) : value;
            const vSchema: TypeValidateSchema = validateSchema as TypeValidateSchema;
            if(vSchema.isRequired && utils.isEmpty(checkValue)) {
                vResult.pass = false;
                vResult.message = vSchema.requireMsg;
            }
            if(vResult.pass && (!utils.isObject(checkValue) && null !== checkValue && undefined !== checkValue)) {
                vResult.pass = false;
                vResult.message = vSchema.valiateMsg;
            }
        }
    } else {
        const formatKey = (validateSchema as TypeValidateSchema).format;
        const formatFn = formatKey && !utils.isEmpty(formatKey) && validateSchema ? (validateCallbacks as any)[formatKey] : null;
        const checkValue = typeof formatFn === "function" ? formatFn(value) : value;
        const vSchema: TypeValidateSchema = validateSchema as TypeValidateSchema;
        if(vSchema.isRequired && utils.isEmpty(checkValue)) {
            vResult.pass = false;
            vResult.message = vSchema.requireMsg;
        }
        if(vResult.pass) {
            if(
                (
                    (vSchema.type === "String" && !utils.isString(checkValue)) ||
                    (vSchema.type === "Number" && !utils.isNumeric(checkValue)) ||
                    (vSchema.type === "Boolean" && !utils.isBoolean(checkValue)) ||
                    (vSchema.type === "Array" && !utils.isArray(checkValue)) ||
                    (utils.isArray(vSchema.type) && vSchema.type.indexOf(checkValue) < 0) ||
                    (utils.isRegExp(vSchema.type) && !vSchema.type.test(checkValue))
                ) &&
                null === checkValue &&
                undefined === checkValue
            ) {
                vResult.pass = false;
                vResult.message = vSchema.valiateMsg;
            }
        }
    }
    return vResult;
}

export const createValidator = <TypeSchema={}, ValidateCallbacks={}>(validateSchema: TypeValidateConfig<TypeSchema, ValidateCallbacks>, validateCallbacks?: ValidateCallbacks) => {
    return {
        validateById(id: string, value: any): TypeValidateResult {
            const vSchema = (validateSchema.properties as any)[id];
            const vResult = validateByValue(value, vSchema, validateCallbacks || {});
            vResult.message = (vResult.message || "").replace(/\{\{[\s]*key[\s]*\}\}/i, id);
            return vResult;
        },
        validate(values: any): TypeValidateResult {
            if(validateSchema.properties) {
                const keys = Object.keys(validateSchema.properties);
                for(const attrKey of keys) {
                    const vSchema = (validateSchema.properties as any)[attrKey];
                    const vValue = utils.isObject(values) ? utils.getValue(values, attrKey) : null;
                    const vResult = validateByValue(vValue, vSchema, validateCallbacks || {});
                    if(!vResult.pass) {
                        vResult.message = (vResult.message || "").replace(/\{\{[\s]*key[\s]*\}\}/i, attrKey);
                        return vResult;
                    }
                }
                return {
                    pass: true
                }
            } else {
                return {
                    pass: false,
                    message: "未定义校验规则。"
                }
            }
        }
    }
};
