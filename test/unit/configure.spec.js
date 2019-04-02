import {configure} from 'resources/index';
import {ReorderableRepeat} from 'resources/reorderable-repeat';
import {ReorderableDirection} from 'resources/reorderable-direction';
import {ReorderableGroup} from 'resources/reorderable-group';
import {ReorderableGroupFor} from 'resources/reorderable-group-for';
import {ReorderableDndPreview} from 'resources/reorderable-dnd-preview';
import {ReorderableDndHandlerSelector} from 'resources/reorderable-dnd-handler-selector';
import {ReorderableAfterReordering} from 'resources/reorderable-after-reordering';

class ConfigStub {
  globalResources(...resources) {
    this.resources = resources;
  }
}

describe('the Aurelia configuration', () => {
  var mockedConfiguration;

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
