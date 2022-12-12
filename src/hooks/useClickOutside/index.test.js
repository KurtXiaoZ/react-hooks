import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRef } from 'react';
import { useClickOutside } from '.';

const blockStyle1 = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '100px',
    height: '100px'
};

const blockStyle2 = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '100px',
    height: '100px'
};

const onClick1 = jest.fn();
const onClick2 = jest.fn();
const onClickOutside1 = jest.fn();
const onClickOutside2 = jest.fn();

test('useClickOutside one block', async () => {
    const TestApp = () => {
        const blockRef1 = useRef();
        useClickOutside([blockRef1], onClickOutside1);
        return <>
            <div
                style={blockStyle1}
                ref={blockRef1}
                onClick={onClick1}
                data-testid='block1'
            ></div>
            <div
                style={blockStyle2}
                onClick={onClick2}
                data-testid='block2'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block1 = await utils.getByTestId('block1'), block2 = await utils.getByTestId('block2');
    await expect(block1).toBeInTheDocument();
    await expect(block2).toBeInTheDocument();
    await fireEvent.click(block1);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClickOutside1).toHaveBeenCalledTimes(0);
    await fireEvent.click(block2);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClickOutside1).toHaveBeenCalledTimes(1);
});

test('useClickOutside two blocks', async () => {
    const TestApp = () => {
        const blockRef1 = useRef();
        const blockRef2 = useRef();
        useClickOutside([blockRef1, blockRef2], onClickOutside1);
        return <>
            <div
                style={blockStyle1}
                ref={blockRef1}
                onClick={onClick1}
                data-testid='block1'
            ></div>
            <div
                style={blockStyle2}
                ref={blockRef2}
                onClick={onClick2}
                data-testid='block2'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block1 = await utils.getByTestId('block1'), block2 = await utils.getByTestId('block2');
    await expect(block1).toBeInTheDocument();
    await expect(block2).toBeInTheDocument();
    await fireEvent.click(block1);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClick2).toHaveBeenCalledTimes(0);
    await expect(onClickOutside1).toHaveBeenCalledTimes(0);
    await fireEvent.click(block2);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClick2).toHaveBeenCalledTimes(1);
    await expect(onClickOutside1).toHaveBeenCalledTimes(0);
    await fireEvent.click(document);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClick2).toHaveBeenCalledTimes(1);
    await expect(onClickOutside1).toHaveBeenCalledTimes(1);
});

test('2 useClickOutside two blocks', async () => {
    const TestApp = () => {
        const blockRef1 = useRef();
        const blockRef2 = useRef();
        useClickOutside([blockRef1], onClickOutside1);
        useClickOutside([blockRef2], onClickOutside2);
        return <>
            <div
                style={blockStyle1}
                ref={blockRef1}
                onClick={onClick1}
                data-testid='block1'
            ></div>
            <div
                style={blockStyle2}
                ref={blockRef2}
                onClick={onClick2}
                data-testid='block2'
            ></div>
        </>;
    }
    const utils = await render(<TestApp />);
    const block1 = await utils.getByTestId('block1'), block2 = await utils.getByTestId('block2');
    await expect(block1).toBeInTheDocument();
    await expect(block2).toBeInTheDocument();
    await fireEvent.click(block1);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClick2).toHaveBeenCalledTimes(0);
    await expect(onClickOutside1).toHaveBeenCalledTimes(0);
    await expect(onClickOutside2).toHaveBeenCalledTimes(1);
    await fireEvent.click(block2);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClick2).toHaveBeenCalledTimes(1);
    await expect(onClickOutside1).toHaveBeenCalledTimes(1);
    await expect(onClickOutside2).toHaveBeenCalledTimes(1);
    await fireEvent.click(document);
    await expect(onClick1).toHaveBeenCalledTimes(1);
    await expect(onClick2).toHaveBeenCalledTimes(1);
    await expect(onClickOutside1).toHaveBeenCalledTimes(2);
    await expect(onClickOutside2).toHaveBeenCalledTimes(2);
});