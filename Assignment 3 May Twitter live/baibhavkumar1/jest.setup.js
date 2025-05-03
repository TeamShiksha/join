// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
};

// Mock window.URL.createObjectURL
if (typeof window !== 'undefined') {
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
}

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
        blob: () => Promise.resolve(new Blob()),
    })
);