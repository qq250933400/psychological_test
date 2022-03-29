import loadable from "@loadable/component";

export const Login = loadable(()=> import(/* webpackChunkName: "Login" */"./Login"));
export const Profile = loadable(()=> import(/* webpackChunkName: "Profile" */"./Profile"));
export const Test = loadable(()=> import(/* webpackChunkName: "Test" */"./Test"));
export const Description = loadable(()=> import(/* webpackChunkName: "Description" */"./Description"));
export const Question = loadable(()=> import(/* webpackChunkName: "Question" */"./Question"));
export const History = loadable(()=> import(/* webpackChunkName: "History" */"./History"));
export const Report = loadable(()=> import(/* webpackChunkName: "Report" */"./Report"));
export const Identity = loadable(()=> import(/** webpackChunkName: "Identity" */"./Identity"));