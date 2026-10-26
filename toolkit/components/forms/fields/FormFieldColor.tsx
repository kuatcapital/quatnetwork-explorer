// Modified by Quat Capital, 2026-10-26: runtime client validation messages. GPL-3.0.
import type { BoxProps } from '@chakra-ui/react';
import { Circle } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFieldPropsBase } from './types';

import { Field } from '../../../chakra/field';
import type { InputProps } from '../../../chakra/input';
import { Input } from '../../../chakra/input';
import { InputGroup } from '../../../chakra/input-group';
import { getFormFieldErrorText } from '../utils/getFormFieldErrorText';
import { colorValidator } from '../validators/color';

export interface FormFieldColorProps<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends FormFieldPropsBase<FormFields, Name> {
  sampleDefaultBgColor?: BoxProps['bgColor'];
}

const FormFieldColorContent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>({
  name,
  placeholder,
  rules,
  onBlur,
  group,
  inputProps,
  size = 'lg',
  disabled,
  sampleDefaultBgColor,
  controllerProps,
  ...restProps
}: FormFieldColorProps<FormFields, Name>) => {
  const { t } = useTranslation();
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules: {
      ...rules,
      required: restProps.required,
      validate: colorValidator,
      maxLength: 7,
    },
    ...controllerProps,
  });

  const [ value, setValue ] = React.useState('');

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = (() => {
      const value = event.target.value;
      if (value) {
        if (value.length === 1 && value[0] !== '#') {
          return `#${ value }`;
        }
      }
      return value;
    })();
    setValue(nextValue);
    field.onChange(nextValue);
  }, [ field ]);

  const handleBlur = React.useCallback(() => {
    field.onBlur();
    onBlur?.();
  }, [ field, onBlur ]);

  const endElement = (
    <Circle
      size="30px"
      bgColor={ field.value && colorValidator(field.value) === true ? field.value : sampleDefaultBgColor }
      borderColor="gray.300"
      borderWidth="1px"
      mx="15px"
    />
  );

  return (
    <Field
      label={ placeholder }
      errorText={ getFormFieldErrorText(fieldState.error, t) }
      invalid={ Boolean(fieldState.error) }
      disabled={ formState.isSubmitting || disabled }
      size={ size }
      floating
      { ...restProps }
    >
      <InputGroup
        { ...group }
        endElement={ endElement }
      >
        <Input
          { ...field }
          autoComplete="off"
          onBlur={ handleBlur }
          onChange={ handleChange }
          value={ value }
          { ...inputProps as InputProps }
        />
      </InputGroup>
    </Field>
  );
};

export const FormFieldColor = React.memo(FormFieldColorContent) as typeof FormFieldColorContent;
