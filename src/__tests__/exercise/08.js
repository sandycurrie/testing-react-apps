// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {act, render, renderHook, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

// 🐨 create a simple function component that uses the useCounter hook
function UseCounterHookExample() {
    const { count, increment, decrement } = useCounter();
    return (
        <div>
            <div>Current count: {count}</div>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    )
}

test('exposes the count and increment/decrement functions', async () => {
    render(<UseCounterHookExample />)

    const label = screen.getByText(/Current count/i);
    const increment = screen.getByRole('button', { name: /increment/i });
    const decrement = screen.getByRole('button', { name: /decrement/i });

    expect(label).toHaveTextContent('Current count: 0');
    await userEvent.click(increment);
    expect(label).toHaveTextContent('Current count: 1');
    await userEvent.click(decrement);
    expect(label).toHaveTextContent('Current count: 0');
})

test('exposes the count and increment/decrement functions - fake component', async () => {
    let result
    function TestComponent(props) {
        result = useCounter(props)
        return null
    }
    render(<TestComponent />)

    expect(result.count).toBe(0);
    await act(() => result.increment());
    expect(result.count).toBe(1);
    await act(() => result.decrement());
    expect(result.count).toBe(0);
})

function setup({initialProps} = {}) {
    const result = {}
    function TestComponent() {
        // have to use an attribute or Object.assign to keep the ref to the original object on rerender.
        result.current = useCounter(initialProps);
        return null
    }

    render(<TestComponent />)
    return result;
}

test('exposes the count and increment/decrement functions - fake component - Part 2', async () => {
    const result = setup({initialProps: { initialCount: 3, step: 2} })
    expect(result.current.count).toBe(3);
    await act(() => result.current.increment());
    expect(result.current.count).toBe(5);
    await act(() => result.current.decrement());
    expect(result.current.count).toBe(3);
})

test('exposes the count and increment/decrement functions - renderHook', async () => {
    const {result, rerender} = renderHook(useCounter, {initialProps: { initialCount: 3, step: 2} })
    expect(result.current.count).toBe(3);
    await act(() => result.current.increment());
    expect(result.current.count).toBe(5);
    rerender({step: 1})
    await act(() => result.current.decrement());
    expect(result.current.count).toBe(4);
})

/* eslint no-unused-vars:0 */
