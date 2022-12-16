import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDebounce } from '.';
import { useState } from 'react';

const funcCount = jest.fn(); 
const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

test(`useDebounce: 
    1) one click on a test block with a debounced onClick handler, callback fires after the delay`, async () => {
    const TestApp = () => {
        const onClick = useDebounce(() => funcCount(), 1000);
        return <div onClick={onClick} data-testid='block'></div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await sleep(1000);
    await expect(funcCount).toHaveBeenCalledTimes(1);
});

test(`useDebounce: 
    1) multiple consecutive clicks on a test block, callback fires after the dalay at the end`, async () => {
    const TestApp = () => {
        const onClick = useDebounce(() => funcCount(), 1000);
        return <div onClick={onClick} data-testid='block'></div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    for(let i = 1; i <= 3; ++i) {
        await fireEvent.click(block);
    }
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await sleep(1000);
    await expect(funcCount).toHaveBeenCalledTimes(1);
});

test(`useDebounce: 
    1) useDebounce depends on every state change
    2) click on a test block with a debounced onClick handler
    3) before we reach the end of the delay, change a state
    4) wait until the delay reaches its end, the hanlder should not be triggered
    5) click on the block again and observe that the handler triggers after the delay`, async () => {
    const TestApp = () => {
        const onClick = useDebounce(() => funcCount(), 1000);
        const [num, setNum] = useState(0);
        return <>
            <div onClick={onClick} data-testid='block'></div>
            <div onClick={() => setNum(num + 1)} data-testid='num'>{num}</div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block'), num = await utils.getByTestId('num');
    await expect(block).toBeInTheDocument();
    await expect(num).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await fireEvent.click(num);
    await expect(num).toHaveTextContent('1');
    await sleep(1100);
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await sleep(1100);
    await expect(funcCount).toHaveBeenCalledTimes(1);
});

test(`useDebounce: 
    1) useDebounce has no dependecies
    2) click on a test block with a debounced onClick handler
    3) before we reach the end of the delay, change a state
    4) wait until the delay reaches its end, the hanlder should be triggered
    5) click on the block again and observe that the handler triggers after the delay`, async () => {
    const TestApp = () => {
        const onClick = useDebounce(() => funcCount(), 1000, []);
        const [num, setNum] = useState(0);
        return <>
            <div onClick={onClick} data-testid='block'></div>
            <div onClick={() => setNum(num + 1)} data-testid='num'>{num}</div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block'), num = await utils.getByTestId('num');
    await expect(block).toBeInTheDocument();
    await expect(num).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await fireEvent.click(num);
    await expect(num).toHaveTextContent('1');
    await sleep(1100);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await fireEvent.click(block);
    await sleep(1100);
    await expect(funcCount).toHaveBeenCalledTimes(2);
});

test(`useDebounce: 
    1) useDebounce depends on an unchanged state
    2) click on a test block with a debounced onClick handler and observe that the handler triggers after the delay`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        const onClick = useDebounce(() => funcCount(), 1000, [num]);
        return <div onClick={onClick} data-testid='block'></div>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block')
    await expect(block).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await sleep(1100);
    await expect(funcCount).toHaveBeenCalledTimes(1);
});

test(`useDebounce: 
    1) useDebounce depends a changed state
    2) click on a test block with a debounced onClick handler
    3) before we reach the end of the delay, change the state
    4) wait until the delay reaches its end, the hanlder should not be triggered
    5) click on the block again and observe that the handler triggers after the delay`, async () => {
    const TestApp = () => {
        const [num, setNum] = useState(0);
        const onClick = useDebounce(() => funcCount(), 1000, [num]);
        return <>
            <div onClick={onClick} data-testid='block'></div>
            <div onClick={() => setNum(num + 1)} data-testid='num'></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block'), num = await utils.getByTestId('num');
    await expect(block).toBeInTheDocument();
    await expect(num).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await fireEvent.click(num);
    await sleep(1100);
    await expect(funcCount).toHaveBeenCalledTimes(0);
    await fireEvent.click(block);
    await sleep(1100);
    await expect(funcCount).toHaveBeenCalledTimes(1);
});