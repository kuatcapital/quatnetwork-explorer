// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import {
  List,
  Box,
  createListCollection,
} from '@chakra-ui/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { FormFields } from '../types';
import type { SmartContractVerificationMethod, SmartContractVerificationConfig } from 'types/client/contract';

import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import type { SelectOption } from 'toolkit/chakra/select';
import { FormFieldSelect } from 'toolkit/components/forms/fields/FormFieldSelect';
import { Hint } from 'toolkit/components/Hint/Hint';

import { getVerificationMethodLabels } from '../utils';

interface Props {
  methods: SmartContractVerificationConfig['verification_options'];
}

const ContractVerificationFieldMethod = ({ methods }: Props) => {
  const { t: tQuat } = useTranslation();
  const methodLabels = React.useMemo(() => getVerificationMethodLabels(tQuat), [ tQuat ]);

  const collection = React.useMemo(() => createListCollection<SelectOption>({
    items: methods.map((method) => ({
      value: method,
      label: methodLabels[method],
    })),
  }), [ methods, methodLabels ]);

  const renderPopoverListItem = React.useCallback((method: SmartContractVerificationMethod) => {
    switch (method) {
      case 'flattened-code':
        return <List.Item key={ method }>{ tQuat('verification.single_file_description') }</List.Item>;
      case 'multi-part':
        return <List.Item key={ method }>{ tQuat('verification.solidity_multi_description') }</List.Item>;
      case 'sourcify':
        return (
          <List.Item key={ method }>
            <Trans i18nKey="verification.sourcify_description" components={{ docs: <Link href="https://sourcify.dev/" external noIcon className="dark"/> }}/>
          </List.Item>
        );
      case 'standard-input':
        return (
          <List.Item key={ method }>
            <Trans
              i18nKey="verification.json_description"
              components={{
                docs: <Link
                  href="https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description"
                  external noIcon className="dark"
                />,
              }}
            />
          </List.Item>
        );
      case 'vyper-code':
        return <List.Item key={ method }>{ tQuat('verification.vyper_description') }</List.Item>;
      case 'vyper-multi-part':
        return <List.Item key={ method }>{ tQuat('verification.vyper_multi_description') }</List.Item>;
      case 'vyper-standard-input':
        return (
          <List.Item key={ method }>
            <Trans
              i18nKey="verification.vyper_json_description"
              components={{
                docs: <Link
                  href="https://docs.vyperlang.org/en/stable/compiling-a-contract.html#compiler-input-and-output-json-description"
                  external noIcon className="dark"
                />,
              }}
            />
          </List.Item>
        );
      case 'solidity-hardhat':
        return <List.Item key={ method }>{ tQuat('verification.hardhat_description') }</List.Item>;
      case 'solidity-foundry':
        return <List.Item key={ method }>{ tQuat('verification.foundry_description') }</List.Item>;
      case 'stylus-github-repository':
        return <List.Item key={ method }>{ tQuat('verification.stylus_description') }</List.Item>;
    }
  }, [ tQuat ]);

  const tooltipContent = (
    <Box>
      <span>{ tQuat('verification.supported_methods_list', { count: methods.length }) }</span>
      <List.Root as="ol" pl={ 5 }>
        { methods.map(renderPopoverListItem) }
      </List.Root>
    </Box>
  );

  return (
    <>
      <Heading level="2" mt={{ base: 10, lg: 6 }} gridColumn={{ lg: '1 / 3' }}>
        { tQuat('verification.supported_methods', { count: methods.length }) }
        <Hint
          label={ tooltipContent }
          tooltipProps={{ interactive: true, contentProps: { textAlign: 'left' } }}
          ml={ 1 }
        />
      </Heading>
      <FormFieldSelect<FormFields, 'method'>
        name="method"
        placeholder={ tQuat('verification.method_placeholder') }
        collection={ collection }
        required
        readOnly={ collection.items.length === 1 }
      />
    </>
  );
};

export default React.memo(ContractVerificationFieldMethod);
