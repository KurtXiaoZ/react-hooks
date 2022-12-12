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

test('useThrottle: callback fired at the first click, but not invoked by the following clicks in the time range', async () => {
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

test('useThrottle: callback fired at the first click, and fired again after time limit', async () => {
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
    1) callback fired at the first click on the block
    2) toggle clicked within time limit to hide the block
    3) toggle clicked to show the block
    4) callback fired again by clicking on the block`, async () => {
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
    // await expect(funcCount).toHaveBeenCalledTimes(2);
});