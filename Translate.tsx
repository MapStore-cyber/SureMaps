import React from 'react';
import { translateText } from '../translations';

interface TranslateProps {
  children: React.ReactNode;
  langId: string;
}

export function Translate({ children, langId }: TranslateProps): React.JSX.Element {
  // If the selected language is English, translation is a no-op fallback, so keeping original tree leads to maximum efficiency.
  if (!langId || langId === 'en') {
    return <>{children}</>;
  }

  function recurse(node: React.ReactNode): React.ReactNode {
    if (node === null || node === undefined) {
      return node;
    }

    if (typeof node === 'string') {
      return translateText(node, langId);
    }

    if (typeof node === 'number' || typeof node === 'boolean') {
      return node;
    }

    if (typeof node === 'function') {
      return node;
    }

    if (Array.isArray(node)) {
      // Mapping keys to avoid missing key warning in dynamic list expansion
      return node.map((child, index) => {
        const mappedChild = recurse(child);
        if (React.isValidElement(mappedChild) && mappedChild.key === null) {
          return React.cloneElement(mappedChild, { key: index });
        }
        return mappedChild;
      });
    }

    if (React.isValidElement(node)) {
      const type = node.type;

      // Skip SVG elements and internal paths/vector data
      if (
        type === 'svg' ||
        type === 'path' ||
        type === 'circle' ||
        type === 'rect' ||
        type === 'line' ||
        type === 'polyline' ||
        type === 'polygon' ||
        type === 'g' ||
        type === 'ellipse' ||
        type === 'defs' ||
        type === 'clipPath' ||
        type === 'mask' ||
        type === 'use' ||
        type === 'image'
      ) {
        return node;
      }

      const { children: childProps, ...otherProps } = node.props as any;
      const newProps: any = { ...otherProps };

      // Translate common text-based HTML attributes
      if (typeof otherProps.placeholder === 'string') {
        newProps.placeholder = translateText(otherProps.placeholder, langId);
      }
      if (typeof otherProps.title === 'string') {
        newProps.title = translateText(otherProps.title, langId);
      }
      if (typeof otherProps.value === 'string' && (type === 'input' || type === 'button')) {
        newProps.value = translateText(otherProps.value, langId);
      }

      if (childProps !== undefined) {
        if (typeof childProps === 'function') {
          // Keep render-props functions intact without traversing
          newProps.children = childProps;
        } else {
          newProps.children = recurse(childProps);
        }
      }

      return React.cloneElement(node, newProps);
    }

    return node;
  }

  return <>{recurse(children)}</>;
}
