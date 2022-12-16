import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useUpdate } from '.';
import { useState } from 'react';

const callback = jest.fn(); 
const cleanUp = jest.fn(); 

test(`useUpdate with callback provided: 
    1) as the div element initially mounts, callback is not invoked
    2) click on the div to update state, callback is invoked`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        useUpdate(callback);
        return <div onClick={() => setNum(prev => prev + 1)} data-testid='block'>{num}</div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await expect(callback).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await expect(callback).toHaveBeenCalledTimes(1);
});

test(`useUpdate with cleanUp provided: 
    1) as the div element initially mounts, cleanUp is not invoked
    2) click on the div to update state, cleanUp is invoked`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        useUpdate(undefined, cleanUp);
        return <div onClick={() => setNum(prev => prev + 1)} data-testid='block'>{num}</div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await expect(cleanUp).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await expect(cleanUp).toHaveBeenCalledTimes(1);
});

test(`useUpdate with callback and cleanUp provided: 
    1) as the div element initially mounts, callback and cleanUp are not invoked
    2) click on the div to update state, callback and cleanUp are invoked`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        useUpdate(callback, cleanUp);
        return <div onClick={() => setNum(prev => prev + 1)} data-testid='block'>{num}</div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await expect(callback).toHaveBeenCalledTimes(0);
    await expect(cleanUp).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await expect(callback).toHaveBeenCalledTimes(1);
    await expect(cleanUp).toHaveBeenCalledTimes(1);
});

test(`useUpdate with callback and an empty array as dependency provided: 
    1) as the div element initially mounts, callback is not invoked
    2) click on the div to update state, callback is not invoked`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        useUpdate(callback, undefined, []);
        return <div onClick={() => setNum(prev => prev + 1)} data-testid='block'>{num}</div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await expect(callback).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await expect(callback).toHaveBeenCalledTimes(0);
});

test(`useUpdate with callback and a changing state as dependency provided: 
    1) as the div element initially mounts, callback is not invoked
    2) click on the div to update state, callback is invoked`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        useUpdate(callback, undefined, [num]);
        return <div onClick={() => setNum(prev => prev + 1)} data-testid='block'>{num}</div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await expect(callback).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await expect(callback).toHaveBeenCalledTimes(1);
});

test(`useUpdate with callback and a non-changing state as dependency provided: 
    1) as the div element initially mounts, callback is not invoked
    2) click on the div to update state, callback is not invoked`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        const [dummyState] = useState();
        useUpdate(callback, undefined, [dummyState]);
        return <div onClick={() => setNum(prev => prev + 1)} data-testid='block'>{num}</div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await expect(callback).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await expect(callback).toHaveBeenCalledTimes(0);
});