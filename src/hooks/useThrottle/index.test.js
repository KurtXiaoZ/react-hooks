import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useThrottle } from '.';
import { useState } from 'react';

const blockStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '100px',
    height: '100px'
};

const funcCount = jest.fn(); 
const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

test(`useThrottle: 
    1) callback fired at the first click
    2) callback not invoked by the following clicks in the time limit`, async () => {
    const TestApp = () => {
        const onClick = useThrottle(() => funcCount(), 5000);
        return <>
            <div
                style={blockStyle}
                onClick={onClick}
                data-testid='block'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(1);
});

test(`useThrottle: 
    1) callback fired at the first click
    2) callback fired again after time limit`, async () => {
    const TestApp = () => {
        const onClick = useThrottle(() => funcCount(), 2000);
        return <>
            <div
                style={blockStyle}
                onClick={onClick}
                data-testid='block'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block');
    await expect(block).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await sleep(2100);
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(2);
});

test(`useThrottle: 
    1) useThrottle depends on every state change
    2) callback fired at the first click on the block
    3) toggle clicked within time limit to hide the block
    4) toggle clicked to show the block
    5) callback fired again by clicking on the block`, async () => {
    const TestApp = () => {
        const onClick = useThrottle(() => funcCount(), 3000);
        const [show, setShow] = useState(true);
        return <>
            {show && <div
                style={blockStyle}
                onClick={onClick}
                data-testid='block'
            ></div>}
            <div
                onClick={() => setShow(!show)}
                data-testid='toggle'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block'), toggle = await utils.getByTestId('toggle');
    await expect(block).toBeInTheDocument();
    await expect(toggle).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await fireEvent.click(toggle);
    await expect(block).not.toBeInTheDocument();
    await fireEvent.click(toggle);
    const newBlock = await utils.getByTestId('block');
    await expect(newBlock).toBeInTheDocument();
    await fireEvent.click(newBlock);
    await expect(funcCount).toHaveBeenCalledTimes(2);
});

test(`useThrottle: 
    1) no dependecy
    2) callback fired at the first click on the block
    3) toggle clicked within time limit to hide the block
    4) toggle clicked to show the block
    5) callback not fired within time limit
    6) callback fired after time limit`, async () => {
    const TestApp = () => {
        const onClick = useThrottle(() => funcCount(), 3000, []);
        const [show, setShow] = useState(true);
        return <>
            {show && <div
                style={blockStyle}
                onClick={onClick}
                data-testid='block'
            ></div>}
            <div
                onClick={() => setShow(!show)}
                data-testid='toggle'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block'), toggle = await utils.getByTestId('toggle');
    await expect(block).toBeInTheDocument();
    await expect(toggle).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await fireEvent.click(toggle);
    await expect(block).not.toBeInTheDocument();
    await fireEvent.click(toggle);
    const newBlock = await utils.getByTestId('block');
    await expect(newBlock).toBeInTheDocument();
    await fireEvent.click(newBlock);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await sleep(3000);
    await fireEvent.click(newBlock);
    await expect(funcCount).toHaveBeenCalledTimes(2);
});

test(`useThrottle: 
    1) useThrottle depends on an unchanged state
    2) callback fired at the first click on the block
    3) toggle clicked within time limit to hide the block
    4) toggle clicked to show the block
    5) callback not fired within time limit
    6) callback fired after time limit`, async () => {
    const TestApp = () => {
        const [placeholderState] = useState();
        const onClick = useThrottle(() => funcCount(), 3000, [placeholderState]);
        const [show, setShow] = useState(true);
        return <>
            {show && <div
                style={blockStyle}
                onClick={onClick}
                data-testid='block'
            ></div>}
            <div
                onClick={() => setShow(!show)}
                data-testid='toggle'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block'), toggle = await utils.getByTestId('toggle');
    await expect(block).toBeInTheDocument();
    await expect(toggle).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await fireEvent.click(toggle);
    await expect(block).not.toBeInTheDocument();
    await fireEvent.click(toggle);
    const newBlock = await utils.getByTestId('block');
    await expect(newBlock).toBeInTheDocument();
    await fireEvent.click(newBlock);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await sleep(3000);
    await fireEvent.click(newBlock);
    await expect(funcCount).toHaveBeenCalledTimes(2);
});

test(`useThrottle: 
    1) useThrottle depends on a changing state
    2) callback fired at the first click on the block
    3) toggle clicked within time limit to hide the block
    4) toggle clicked to show the block
    6) callback fired by clicking`, async () => {
    const TestApp = () => {
        const [show, setShow] = useState(true);
        const onClick = useThrottle(() => funcCount(), 3000, [show]);
        return <>
            {show && <div
                style={blockStyle}
                onClick={onClick}
                data-testid='block'
            ></div>}
            <div
                onClick={() => setShow(!show)}
                data-testid='toggle'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block = await utils.getByTestId('block'), toggle = await utils.getByTestId('toggle');
    await expect(block).toBeInTheDocument();
    await expect(toggle).toBeInTheDocument();
    await fireEvent.click(block);
    await expect(funcCount).toHaveBeenCalledTimes(1);
    await fireEvent.click(toggle);
    await expect(block).not.toBeInTheDocument();
    await fireEvent.click(toggle);
    const newBlock = await utils.getByTestId('block');
    await expect(newBlock).toBeInTheDocument();
    await fireEvent.click(newBlock);
    await expect(funcCount).toHaveBeenCalledTimes(2);
});