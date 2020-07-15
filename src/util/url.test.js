import {getRelativeURL} from './url';

test('gets relative url from "http://www.google.com/test" which equals "/test"', () => {
  expect(getRelativeURL('http://www.google.com/test')).toBe('/test');
});

test('gets relative url from "http://google.com/test" which equals "/test"', () => {
  expect(getRelativeURL('http://google.com/test')).toBe('/test');
});

test('gets relative url from "http://google.com/test?query=test" which equals "/test?query=test"', () => {
  expect(getRelativeURL('http://google.com/test?query=test')).toBe('/test?query=test');
});

test('gets relative url from "/test" with base url which equals "/test"', () => {
  expect(getRelativeURL('/test', 'http://www.google.com')).toBe('/test');
});