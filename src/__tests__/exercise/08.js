// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {act, render, screen} from '@testing-library/react'
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

/* eslint no-unused-vars:0 */
