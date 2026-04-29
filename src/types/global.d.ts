// oxlint-disable-next-line typescript/consistent-type-definitions -- interface required for declaration merging with global Window
interface Window {
  gtag?: (...args: unknown[]) => void;
}
