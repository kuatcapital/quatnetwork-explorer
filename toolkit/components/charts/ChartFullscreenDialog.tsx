// Modified by Quat Capital, 2026-10-26: runtime chart controls. GPL-3.0.
import { Grid, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Resolution, TimeChartData } from './types';

import RepeatIcon from 'icons/repeat.svg';
import { Heading } from 'toolkit/chakra/heading';

import { Button } from '../../chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from '../../chakra/dialog';
import { ChartWidgetContent } from './ChartWidgetContent';

export interface Props {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  title: string;
  description?: string;
  charts: TimeChartData;
  resolution?: Resolution;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  handleZoomReset: () => void;
};

const FullscreenChartModal = ({
  charts,
  open,
  onOpenChange,
  title,
  description,
  resolution,
  zoomRange,
  handleZoom,
  handleZoomReset,
}: Props) => {
  const { t } = useTranslation();
  return (
    <DialogRoot
      open={ open }
      onOpenChange={ onOpenChange }
      // FIXME: with size="full" the chart will not be expanded to the full height of the modal
      size="cover"
    >
      <DialogContent>
        <DialogHeader/>
        <DialogBody pt={ 6 } display="flex" flexDir="column">
          <Grid gridColumnGap={ 2 } mb={ 4 }>
            <Heading mb={ 1 } level="2">
              { title }
            </Heading>

            { description && (
              <Text
                gridColumn={ 1 }
                color="text.secondary"
                textStyle="sm"
              >
                { description }
              </Text>
            ) }

            { Boolean(zoomRange) && (
              <Button
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="sm"
                variant="outline"
                onClick={ handleZoomReset }
              >
                <Icon boxSize={ 4 }><RepeatIcon/></Icon>
                { t('charts.reset_zoom') }
              </Button>
            ) }
          </Grid>
          <ChartWidgetContent
            isEnlarged
            charts={ charts }
            handleZoom={ handleZoom }
            zoomRange={ zoomRange }
            resolution={ resolution }
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default FullscreenChartModal;
