
//forwardRef is a React fuction that allows you to forward refs to 
//the underlying DOM element or component

//useState a react hook that lest you add state to your functional component

//TextInput a pre-styled component form mantine

//cn from the classnames library that helps conditionaly join class names together
import { forwardRef, useState } from 'react';
import { TextInput } from '@mantine/core';
import cn from 'classnames';

//forwardRef wraps the input component to forward the 'ref' to the TextInput component.
export const Input = forwardRef<
//these are the types for the forwarded ref props
  HTMLInputElement, // type of ref being forwarded
  React.ComponentProps<typeof TextInput> // type of props the textInput accepts
>(({ className, value, onChange, ...rest }, ref) => {
  const [focused, setFocused] = useState(false);

  //determins if the label should be floating based on wheter the input has value or is focused
  const floating = value?.toString().trim().length !== 0 || focused || undefined;

  return (
    <TextInput
      {...rest}
      ref={ref}
      classNames={{
        input: cn(
          'w-full px-5 py-2 bg-transparent border-2 outline-none border-zinc-600 rounded-xl placeholder:text-zinc-500 focus:border-white',
          className
        )
      }}
      value={value}
      onChange={(event) => {
        onChange && onChange(event); 
      }}
      onFocus={(event) => {
        setFocused(true);
        rest.onFocus && rest.onFocus(event); 
      }}
      onBlur={(event) => {
        setFocused(false);
        rest.onBlur && rest.onBlur(event); 
      }}
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
});


























