// Modified by Quat Capital, 2026-10-25: T18 reviewed literal localization. GPL-3.0.
import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Switch } from 'toolkit/chakra/switch';
import { Hint } from 'toolkit/components/Hint/Hint';

interface Props {
  id: string;
  onChange: (isChecked: boolean) => void;
  initialValue?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const UserOpCallDataSwitch = ({ className, initialValue, isDisabled, onChange, id }: Props) => {
  const { t: tQuat } = useTranslation();

  const [ isChecked, setIsChecked ] = React.useState(initialValue ?? false);

  const handleChange = React.useCallback(() => {
    setIsChecked((prevValue) => {
      const nextValue = !prevValue;
      onChange(nextValue);
      return nextValue;
    });
  }, [ onChange ]);

  return (
    <Flex ml="auto" alignItems="center" gap={ 2 }>
      <Switch
        className={ className }
        id={ id }
        checked={ isChecked }
        disabled={ isDisabled }
        onCheckedChange={ handleChange }
        direction="rtl"
        labelProps={{ fontWeight: '600', textStyle: 'sm' }}
      >
        <chakra.span hideBelow="lg">{ tQuat('operationsUi.show_external') }</chakra.span>
        <chakra.span hideFrom="lg">{ tQuat('operationsUi.external_data') }</chakra.span>
      </Switch>
      <Hint label={ tQuat('operationsUi.inner_hint') }/>
    </Flex>
  );
};

export default React.memo(chakra(UserOpCallDataSwitch));
