
import { forwardRef, useState } from 'react';
import { TextInput } from '@mantine/core';
import cn from 'classnames';

export const Input = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof TextInput> // Use Mantine TextInput props
>(({ className, ...rest }, ref) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const floating = value.trim().length !== 0 || focused || undefined;

  return (
    <TextInput
      {...rest}
      ref={ref}
      classNames={{ input: cn('w-full px-5 py-2 bg-transparent border-2 outline-none border-zinc-600 rounded-xl placeholder:text-zinc-500 focus:border-white', className) }}
      value={value}
      onChange={(event) => {
        setValue(event.currentTarget.value);
        rest.onChange && rest.onChange(event); // Ensure to call the passed onChange handler
      }}
      onFocus={(event) => {
        setFocused(true);
        rest.onFocus && rest.onFocus(event); // Ensure to call the passed onFocus handler
      }}
      onBlur={(event) => {
        setFocused(false);
        rest.onBlur && rest.onBlur(event); // Ensure to call the passed onBlur handler
      }}
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  );
});



























// import { InputHTMLAttributes, forwardRef } from 'react'
// import cn from 'classnames'

// //uses forwardRef to forward the ref to the underlying input element,
// //allows the parent components to access and manipulate input element
// //directly
// export const Input = forwardRef<
// //ensures ref is compatible with the input elements expected type
//   HTMLInputElement,
//   //specifies the type of props object the component accepts
//   InputHTMLAttributes<HTMLInputElement>
// >(({ className, ...rest }, ref) => {
//   return (
//     <input
//       {...rest}
//       //ref is assigned to the underlaying input element using the
//       //ref attribute, enableing parent component to reference input elemnt
//       ref={ref}
//       className={cn(
//         'w-full px-5 py-2 bg-transparent border-2 outline-none border-zinc-600 rounded-xl placeholder:text-zinc-500 focus:border-white',
//         className,
//       )}
//     />
//   )
// })