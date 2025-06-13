/**
 * Global type declarations for the view-builder package
 */

// Extend React types
declare namespace React {
  // Ensure ReactNode is properly defined
  type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;
  
  // Ensure React.FC is properly defined
  type FC<P = {}> = React.FunctionComponent<P>;
  
  // Ensure React.FunctionComponent is properly defined
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }
  
  // Ensure ForwardRefExoticComponent is properly defined
  interface ForwardRefExoticComponent<P> extends React.FC<P> {
    defaultProps?: Partial<P>;
    displayName?: string;
  }
}

// Ensure JSX namespace is properly defined
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface ElementClass extends React.Component<any> {
    render(): React.ReactNode;
  }
  interface ElementAttributesProperty {
    props: {};
  }
  interface ElementChildrenAttribute {
    children: {};
  }
  interface IntrinsicAttributes extends React.Attributes {}
  interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
}
