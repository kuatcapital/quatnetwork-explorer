// Modified by Quat Capital, 2026-10-26: runtime toolkit labels for RU/KK/EN. GPL-3.0.
import type { ButtonProps } from '@chakra-ui/react';
import { Icon, useRecipe } from '@chakra-ui/react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import CloseIcon from 'icons/close.svg';

import { recipe as closeButtonRecipe } from '../theme/recipes/close-button.recipe';
import { IconButton } from './icon-button';
export interface CloseButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  variant?: 'plain';
  size?: 'md';
}

export const CloseButton = React.forwardRef<
  HTMLButtonElement,
  CloseButtonProps
>(function CloseButton(props, ref) {
  const { t } = useTranslation();
  const recipe = useRecipe({ recipe: closeButtonRecipe });
  const [ recipeProps, restProps ] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);

  return (
    <IconButton aria-label={ t('toolkit.close') } ref={ ref } css={ styles } { ...restProps }>
      { props.children ?? <Icon boxSize={ 5 }><CloseIcon/></Icon> }
    </IconButton>
  );
});
