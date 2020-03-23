import {configure} from '../src/index';
import {ReorderableRepeat} from '../src/reorderable-repeat';
import {ReorderableDirection} from '../src/reorderable-direction';
import {ReorderableGroup} from '../src/reorderable-group';
import {ReorderableGroupFor} from '../src/reorderable-group-for';
import {ReorderableDndPreview} from '../src/reorderable-dnd-preview';
import {ReorderableDndHandlerSelector} from '../src/reorderable-dnd-handler-selector';
import {ReorderableAfterReordering} from '../src/reorderable-after-reordering';

class ConfigStub {
  globalResources(...resources) {
    this.resources = resources;
  }
}

describe('the Aurelia configuration', () => {
  let mockedConfiguration;

  beforeEach(() => {
    mockedConfiguration = new ConfigStub();
    configure(mockedConfiguration);
  });

  it('should register a global resource', () => {
    expect(mockedConfiguration.resources).toContain([
      ReorderableRepeat,
      ReorderableDirection,
      ReorderableGroup,
      ReorderableGroupFor,
      ReorderableDndPreview,
      ReorderableDndHandlerSelector,
      ReorderableAfterReordering
    ]);
  });
});
