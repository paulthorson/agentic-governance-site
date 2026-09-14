'use client';

import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Grid} from '@astryxdesign/core/Grid';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import type {TractionMetric} from '@/lib/traction';

export function TractionStrip({
  visible,
  hiddenCount,
}: {
  visible: TractionMetric[];
  hiddenCount: number;
}) {
  // Widgets are fully implemented; launch defaults hide everything via
  // data/traction.json minVisible + null values (config-only reveal).
  if (visible.length === 0) {
    return null;
  }

  return (
    <VStack gap={3}>
      <HStack hAlign="between" vAlign="center" wrap="wrap" gap={2}>
        <Heading level={2}>
          Traction
        </Heading>
        {hiddenCount > 0 && (
          <Text type="supporting" color="secondary">
            {hiddenCount} metric{hiddenCount === 1 ? '' : 's'} gated below
            threshold
          </Text>
        )}
      </HStack>
      <Grid columns={{minWidth: 180, repeat: 'fit'}} gap={3}>
        {visible.map((metric) => (
          <Card key={metric.id} padding={4} elevation="low">
            <VStack gap={2}>
              <Text type="supporting" color="secondary">
                {metric.label}
              </Text>
              <Heading level={3} type="display-3">
                {metric.value}
              </Heading>
              {metric.href ? (
                <Button
                  label={`View ${metric.unit}`}
                  variant="ghost"
                  size="sm"
                  href={metric.href}
                />
              ) : (
                <Text type="supporting" color="secondary">
                  {metric.unit}
                </Text>
              )}
            </VStack>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
}

/** Always present in the tree for Cos threshold flips — renders nothing when gated. */
export function TractionGate({
  visible,
  hiddenCount,
}: {
  visible: TractionMetric[];
  hiddenCount: number;
}) {
  return <TractionStrip visible={visible} hiddenCount={hiddenCount} />;
}
