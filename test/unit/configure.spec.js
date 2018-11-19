import {configure} from '../../src/resources/index';
import {ReorderableRepeat} from '../../src/resources/reorderable-repeat';
import {ReorderableDirection} from '../../src/resources/reorderable-direction';
import {ReorderableGroup} from '../../src/resources/reorderable-group';
import {ReorderableGroupFor} from '../../src/resources/reorderable-group-for';
import {ReorderableDndPreview} from '../../src/resources/reorderable-dnd-preview';
import {ReorderableDndHandlerSelector} from '../../src/resources/reorderable-dnd-handler-selector';
import {ReorderableAfterReordering} from '../../src/resources/reorderable-after-reordering';

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
