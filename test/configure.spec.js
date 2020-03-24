import {configure} from '../src/index';
import {ReorderableRepeat} from '../src/reorderable-repeat';
import {ReorderableDirection} from '../src/reorderable-direction';
import {ReorderableGroup} from '../src/reorderable-group';
import {ReorderableGroupFor} from '../src/reorderable-group-for';
import {ReorderableDndPreview} from '../src/reorderable-dnd-preview';
import {ReorderableDndHandlerSelector} from '../src/reorderable-dnd-handler-selector';
import {ReorderableAfterReordering} from '../src/reorderable-after-reordering';
import test from 'tape-promise/tape';

class ConfigStub {
  globalResources(resources) {
    this.resources = resources;
  }
}

test('Aurelia configuration should register a global resource', async t => {
  const mockedConfiguration = new ConfigStub();
  configure(mockedConfiguration);
  t.deepEqual(mockedConfiguration.resources, [
    ReorderableRepeat,
    ReorderableDirection,
    ReorderableGroup,
    ReorderableGroupFor,
    ReorderableDndPreview,
    ReorderableDndHandlerSelector,
    ReorderableAfterReordering
  ]);
});
