// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { Checkbox } from 'toolkit/chakra/checkbox';
import { useUpdateEffect } from 'toolkit/hooks/useUpdateEffect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationFieldLibraryItem from './ContractVerificationFieldLibraryItem';

const ContractVerificationFieldLibraries = () => {
  const { t: tQuat } = useTranslation();

  const { formState, control, getValues } = useFormContext<FormFields>();
  const { fields, append, remove, insert } = useFieldArray({
    name: 'libraries',
    control,
  });
  const [ isEnabled, setIsEnabled ] = React.useState(fields.length > 0);

  const value = getValues('libraries');

  useUpdateEffect(() => {
    if (!value || value.length === 0) {
      setIsEnabled(false);
    }
  }, [ value ]);

  const handleCheckboxChange = React.useCallback(() => {
    if (!isEnabled) {
      append({ name: '', address: '' });
    } else {
      remove();
    }
    setIsEnabled(prev => !prev);
  }, [ append, isEnabled, remove ]);

  const handleAddFieldClick = React.useCallback((index: number) => {
    insert(index + 1, { name: '', address: '' });
  }, [ insert ]);

  const handleRemoveFieldClick = React.useCallback((index: number) => {
    remove(index);
  }, [ remove ]);

  return (
    <>
      <ContractVerificationFormRow>
        <Checkbox
          onChange={ handleCheckboxChange }
          mt={ 9 }
          disabled={ formState.isSubmitting }
        >{ tQuat('verification.add_libraries') }</Checkbox>
      </ContractVerificationFormRow>
      { fields.map((field, index) => (
        <ContractVerificationFieldLibraryItem
          key={ field.id }
          index={ index }
          fieldsLength={ fields.length }
          onAddFieldClick={ handleAddFieldClick }
          onRemoveFieldClick={ handleRemoveFieldClick }
          isDisabled={ formState.isSubmitting }
        />
      )) }
    </>
  );
};

export default React.memo(ContractVerificationFieldLibraries);
