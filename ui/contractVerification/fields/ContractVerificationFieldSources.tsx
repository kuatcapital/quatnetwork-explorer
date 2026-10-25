// Modified by Quat Capital, 2026-10-25: localize contract verification interface. GPL-3.0.
import { Text, Box, Flex, VStack } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldPathValue, ValidateResult } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { FormFields } from '../types';

import { Button } from 'toolkit/chakra/button';
import { FormFieldError } from 'toolkit/components/forms/components/FormFieldError';
import { DragAndDropArea } from 'toolkit/components/forms/inputs/file/DragAndDropArea';
import { FileInput } from 'toolkit/components/forms/inputs/file/FileInput';
import { FileSnippet } from 'toolkit/components/forms/inputs/file/FileSnippet';
import { Mb } from 'toolkit/utils/consts';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

type FileTypes = '.sol' | '.yul' | '.json' | '.vy';

interface Props {
  name?: 'sources' | 'interfaces';
  fileTypes: Array<FileTypes>;
  fullFilePath?: boolean;
  multiple?: boolean;
  required?: boolean;
  title: string;
  hint: string | React.ReactNode;
}

const ContractVerificationFieldSources = ({ fileTypes, multiple, required, title, hint, name = 'sources', fullFilePath }: Props) => {
  const { t: tQuat } = useTranslation();
  const { setValue, getValues, control, formState, clearErrors, trigger, getFieldState } = useFormContext<FormFields>();
  React.useEffect(() => {
    const type = getFieldState(name).error?.type;
    if (type === 'file_type' || type === 'file_size' || type === 'quantity') void trigger(name);
  }, [ getFieldState, name, trigger, tQuat ]);

  const error = (() => {
    if (name === 'sources' && 'sources' in formState.errors) {
      return formState.errors.sources;
    }

    if (name === 'interfaces' && 'interfaces' in formState.errors) {
      return formState.errors.interfaces;
    }
  })();
  const commonError = !error?.type?.startsWith('file_') ? error : undefined;
  const fileError = error?.type?.startsWith('file_') ? error : undefined;

  const handleFileRemove = React.useCallback((index?: number) => {
    if (index === undefined) {
      return;
    }

    const value = getValues(name).slice();
    value.splice(index, 1);
    setValue(name, value);
    clearErrors(name);

  }, [ getValues, name, setValue, clearErrors ]);

  const renderUploadButton = React.useCallback(() => {
    return (
      <VStack gap={ 3 }>
        <Text fontWeight={ 500 }>{ title }</Text>
        <Button size="sm" variant="outline">
          { tQuat(multiple ? 'verification.drop_files' : 'verification.drop_file') }
        </Button>
      </VStack>
    );
  }, [ multiple, title, tQuat ]);

  const renderFiles = React.useCallback((files: Array<File>) => {
    const errorList = fileError?.message?.split(';');

    return (
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }}
        columnGap={ 3 }
        rowGap={ 3 }
        w="100%"
      >
        { files.map((file, index) => (
          <Box key={ file.name + file.lastModified + index }>
            <FileSnippet
              file={ file }
              maxW="initial"
              onRemove={ handleFileRemove }
              index={ index }
              isDisabled={ formState.isSubmitting }
              error={ errorList?.[index] }
            />
          </Box>
        )) }
      </Box>
    );
  }, [ formState.isSubmitting, handleFileRemove, fileError ]);

  const renderControl = React.useCallback(({ field }: { field: ControllerRenderProps<FormFields, typeof name> }) => {
    const hasValue = field.value && field.value.length > 0;

    const errorElement = (() => {
      if (commonError?.type === 'required') {
        return <FormFieldError message={ tQuat('verification.required_field') }/>;
      }

      if (commonError?.message) {
        return <FormFieldError message={ commonError.message }/>;
      }

      return null;
    })();

    return (
      <>
        <FileInput<FormFields, typeof name> accept={ fileTypes.join(',') } multiple={ multiple } field={ field }>
          { ({ onChange }) => (
            <Flex
              flexDir="column"
              alignItems="flex-start"
              rowGap={ 2 }
              w="100%"
            >
              <DragAndDropArea
                onDrop={ onChange }
                fullFilePath={ fullFilePath }
                p={{ base: 3, lg: 6 }}
                isDisabled={ formState.isSubmitting }
                isInvalid={ Boolean(error) }
              >
                { hasValue ? renderFiles(field.value) : renderUploadButton() }
              </DragAndDropArea>
            </Flex>
          ) }
        </FileInput>
        { errorElement }
      </>
    );
  }, [ fileTypes, multiple, commonError?.type, commonError?.message, fullFilePath, formState.isSubmitting, error, renderFiles, renderUploadButton, tQuat ]);

  const validateFileType = React.useCallback(async(value: FieldPathValue<FormFields, typeof name>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const errorText = tQuat('verification.wrong_file_type', { types: fileTypes.join(',') });
      const errors = value.map(({ name }) => fileTypes.some((ext) => name.endsWith(ext)) ? '' : errorText);
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, [ fileTypes, tQuat ]);

  const validateFileSize = React.useCallback(async(value: FieldPathValue<FormFields, typeof name>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const FILE_SIZE_LIMIT = 20 * Mb;
      const errors = value.map(({ size }) => size > FILE_SIZE_LIMIT ? tQuat('verification.file_too_big') : '');
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, [ tQuat ]);

  const validateQuantity = React.useCallback(async(value: FieldPathValue<FormFields, typeof name>): Promise<ValidateResult> => {
    if (!multiple && Array.isArray(value) && value.length > 1) {
      return tQuat('verification.one_file_only');
    }

    return true;
  }, [ multiple, tQuat ]);

  const rules = React.useMemo(() => ({
    required,
    validate: {
      file_type: validateFileType,
      file_size: validateFileSize,
      quantity: validateQuantity,
    },
  }), [ validateFileSize, validateFileType, validateQuantity, required ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name={ name }
        control={ control }
        render={ renderControl }
        rules={ rules }
      />
      { hint ? <span>{ hint }</span> : null }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldSources);
