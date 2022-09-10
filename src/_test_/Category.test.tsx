import React, { useCallback } from 'react';
import { render, screen } from '@testing-library/react';
import ServiceWrapper, { useService } from "./ServiceWrapper";

const TestApp = () => {
    const serviceObj = useService();
    const onSendClick = useCallback(() => {
        serviceObj.send({
            endPoint: "wenjuan.category",
        }).then((data) => {
            console.log(data);
        }).catch((err) => {
            console.error(err);
        })
    }, []);
    return (
        <div>
            <button data-testid="send" onClick={onSendClick}>Send Request</button>
        </div>
    );
};


test('renders learn react link', () => {
    render(<ServiceWrapper><TestApp /></ServiceWrapper>);
    const linkElement = screen.getByTestId(/send/i);
    linkElement.click();
    expect(linkElement).toBeInTheDocument();
});