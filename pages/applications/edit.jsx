import React, { useState } from 'react';
import {
  Page,
  Layout,
  Card,
  TextField,
  Select,
  Checkbox,
  DatePicker,
  Button,
  BlockStack,
  Text,
  FormLayout,
  InlineStack,
  Badge,
  Icon,
  Box,
} from '@shopify/polaris';
import { formFieldTypes, fieldCategories, formTemplates } from './formSelectorTemplates';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  CSS
} from '@dnd-kit/utilities';
import {
  TextBlockMajor,
  SelectMajor,
  EmailMajor,
  PhoneMajor,
  CalendarMajor,
  CheckboxMajor,
  TextAlignmentLeftMajor,
  DragHandleMinor,
} from '@shopify/polaris-icons';

// Form element types definition
const formElements = {
  TEXT: {
    type: 'text',
    icon: TextBlockMajor,
    label: 'Text Field',
    properties: {
      label: 'Text Field',
      placeholder: 'Enter text',
      helpText: '',
      required: false,
      disabled: false,
    },
  },
  TEXTAREA: {
    type: 'textarea',
    icon: TextAlignmentLeftMajor,
    label: 'Text Area',
    properties: {
      label: 'Text Area',
      placeholder: 'Enter long text',
      helpText: '',
      required: false,
      disabled: false,
      rows: 4,
    },
  },
  EMAIL: {
    type: 'email',
    icon: EmailMajor,
    label: 'Email Field',
    properties: {
      label: 'Email',
      placeholder: 'Enter email',
      helpText: '',
      required: false,
      disabled: false,
    },
  },
  PHONE: {
    type: 'tel',
    icon: PhoneMajor,
    label: 'Phone Field',
    properties: {
      label: 'Phone',
      placeholder: 'Enter phone number',
      helpText: '',
      required: false,
      disabled: false,
    },
  },
  SELECT: {
    type: 'select',
    icon: SelectMajor,
    label: 'Select Field',
    properties: {
      label: 'Select',
      options: ['Option 1', 'Option 2', 'Option 3'],
      helpText: '',
      required: false,
      disabled: false,
    },
  },
  CHECKBOX: {
    type: 'checkbox',
    icon: CheckboxMajor,
    label: 'Checkbox',
    properties: {
      label: 'Checkbox label',
      checked: false,
      helpText: '',
      disabled: false,
    },
  },
  DATE: {
    type: 'date',
    icon: CalendarMajor,
    label: 'Date Field',
    properties: {
      label: 'Date',
      helpText: '',
      required: false,
      disabled: false,
    },
  },
};


// Sortable form element component
const SortableFormElement = ({ element, onSelect, isSelected }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card sectioned>
        <div className="sortable-item">
          <BlockStack alignment="center">
            <div {...attributes} {...listeners}>
              <Icon source={DragHandleMinor} color="base" />
            </div>
            <BlockStack.Item fill>
              <div
                onClick={() => onSelect(element)}
                style={{
                  cursor: 'pointer',
                  padding: '8px',
                  backgroundColor: isSelected ? 'rgba(0,0,0,0.05)' : 'transparent',
                }}
              >
                <FormElementPreview element={element} />
              </div>
            </BlockStack.Item>
          </BlockStack>
        </div>
      </Card>
    </div>
  );
};

// Form element preview component
const FormElementPreview = ({ element }) => {
  const { type, properties } = element;
  const [{ month, year }, setDate] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });

  switch (type) {
    case 'text':
    case 'email':
    case 'tel':
      return (
        <TextField
          label={properties.label}
          type={type}
          placeholder={properties.placeholder}
          helpText={properties.helpText}
          disabled={properties.disabled}
          required={properties.required}
        />
      );
    case 'textarea':
      return (
        <TextField
          label={properties.label}
          placeholder={properties.placeholder}
          helpText={properties.helpText}
          multiline={properties.rows}
          disabled={properties.disabled}
          required={properties.required}
        />
      );
    case 'select':
      return (
        <Select
          label={properties.label}
          options={properties.options.map(option => ({ label: option, value: option }))}
          helpText={properties.helpText}
          disabled={properties.disabled}
          required={properties.required}
        />
      );
    case 'checkbox':
      return (
        <Checkbox
          label={properties.label}
          checked={properties.checked}
          helpText={properties.helpText}
          disabled={properties.disabled}
        />
      );
    case 'date':
      return (
        <DatePicker
          month={month}
          year={year}
          onChange={setDate}
          onMonthChange={(month, year) => setDate({ month, year })}
        />
      );
    default:
      return null;
  }
};

const ElementsList = ({ elements, onSelect, selectedElement, onRemove, onDuplicate, onMoveUp, onMoveDown }) => {
  return (
    <Card>
      <Box padding="4">
        <BlockStack gap="4">
          <InlineStack align="space-between">
            <Text variant="headingMd">Form Elements ({elements.length})</Text>
            <Badge tone="info">{elements.length} items</Badge>
          </InlineStack>

          {elements.map((element, index) => (
            <Card
              key={element.id}
              background={selectedElement?.id === element.id ? "bg-surface-selected" : "bg-surface"}
            >
              <Box padding="3">
                <InlineStack align="space-between" wrap={false}>
                  <InlineStack gap="3" align="start" wrap={false}>
                    <Icon source={DragHandleMinor} tone="base" />
                    <BlockStack gap="1">
                      <Text variant="bodyMd" fontWeight="bold">
                        {element.properties.label || element.label}
                      </Text>
                      <Text variant="bodySm" tone="subdued">
                        Type: {element.type}
                      </Text>
                    </BlockStack>
                  </InlineStack>

                  <InlineStack gap="2" wrap={false}>
                    {index > 0 && (
                      <Button
                        icon={ChevronUpMinor}
                        onClick={() => onMoveUp(index)}
                        variant="tertiary"
                        tone="base"
                      />
                    )}
                    {index < elements.length - 1 && (
                      <Button
                        icon={ChevronDownMinor}
                        onClick={() => onMoveDown(index)}
                        variant="tertiary"
                        tone="base"
                      />
                    )}
                    <Button
                      icon={DuplicateMinor}
                      onClick={() => onDuplicate(element)}
                      variant="tertiary"
                      tone="base"
                    />
                    <Button
                      icon={DeleteMinor}
                      onClick={() => onRemove(element.id)}
                      variant="tertiary"
                      tone="critical"
                    />
                  </InlineStack>
                </InlineStack>
              </Box>
            </Card>
          ))}

          {elements.length === 0 && (
            <Box
              padding="4"
              background="bg-surface-secondary"
              borderRadius="2"
            >
              <Text alignment="center" tone="subdued">
                No elements added yet. Drag elements from the left panel to start building your form.
              </Text>
            </Box>
          )}
        </BlockStack>
      </Box>
    </Card>
  );
};

const FormBuilder = () => {
  const [formElements, setFormElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const groupedFields = Object.entries(formFieldTypes).reduce((acc, [key, field]) => {
    const category = field.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push({ key, ...field });
    return acc;
  }, {});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    // Handle dropping new elements from sidebar
    if (active.id.startsWith('sidebar-') && over?.id) {
      const elementType = active.id.split('-')[1];
      const newElement = {
        id: `form-${Date.now()}`,
        type: elementType,
        ...formElements[elementType],
      };

      const overIndex = formElements.findIndex(item => item.id === over.id);
      const newElements = [...formElements];
      newElements.splice(overIndex, 0, newElement);
      setFormElements(newElements);
    }
  };

  const handlePropertyChange = (propertyName, value) => {
    if (!selectedElement) return;

    setFormElements(elements =>
      elements.map(element =>
        element.id === selectedElement.id
          ? {
            ...element,
            properties: {
              ...element.properties,
              [propertyName]: value,
            },
          }
          : element
      )
    );
  };

  const handleDuplicateElement = (element) => {
    const newElement = {
      ...element,
      id: `form-${Date.now()}`,
      properties: { ...element.properties },
    };
    setFormElements([...formElements, newElement]);
  };

  const handleMoveElement = (fromIndex, toIndex) => {
    const newElements = [...formElements];
    const [movedElement] = newElements.splice(fromIndex, 1);
    newElements.splice(toIndex, 0, movedElement);
    setFormElements(newElements);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id.startsWith('sidebar-') && over.id === 'form-drop-area') {
      // Handle dropping new elements from sidebar to form area
      const elementType = active.id.split('-')[1];
      const newElement = {
        id: `form-${Date.now()}`,
        type: elementType,
        ...formFieldTypes[elementType],
      };
      setFormElements((prev) => [...prev, newElement]);
    } else if (active.id !== over.id) {
      // Handle reordering existing elements
      setFormElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };



  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--p-color-bg-surface-secondary)' }}>
      {/* Left Sidebar */}
      <div style={{
        width: '300px',
        borderRight: '1px solid var(--p-color-border-secondary)',
        backgroundColor: 'var(--p-color-bg-surface)',
        height: '100%',
        overflowY: 'auto',
        padding: 'var(--p-space-4)',
      }}>
        <BlockStack gap="4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
            {/* Available Elements Section */}
            <Card>
              <Box padding="4">
                <Text variant="headingMd">Available Elements</Text>
                <BlockStack gap="4">
                  {fieldCategories.map(category => (
                    <Box key={category.id} padding="3">
                      <Text variant="headingSm">{category.label}</Text>
                      <Text tone="subdued" as="p">{category.description}</Text>
                      <BlockStack gap="2">
                        {groupedFields[category.id]?.map(field => (
                          <div
                            key={`sidebar-${field.key}`}
                            style={{ cursor: 'move' }}
                          >
                            <Button
                              icon={field.icon}
                              fullWidth
                              textAlign="left"
                              variant="tertiary"
                              draggable
                              data-type={field.type}
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', `sidebar-${field.key}`);
                                handleDragStart({ active: { id: `sidebar-${field.key}` } });
                              }}
                            >
                              {field.label}
                            </Button>
                          </div>
                        ))}
                      </BlockStack>
                    </Box>
                  ))}
                </BlockStack>
              </Box>
            </Card>

            {/* Elements List Section */}
            <ElementsList
              elements={formElements}
              selectedElement={selectedElement}
              onSelect={setSelectedElement}
              onRemove={(id) => {
                setFormElements(elements => elements.filter(e => e.id !== id));
                if (selectedElement?.id === id) {
                  setSelectedElement(null);
                }
              }}
              onDuplicate={handleDuplicateElement}
              onMoveUp={(index) => handleMoveElement(index, index - 1)}
              onMoveDown={(index) => handleMoveElement(index, index + 1)}
            />

            {/* Properties Panel */}
            {selectedElement && (
              <Card>
                <Box padding="4">
                  <BlockStack gap="4">
                    <Text variant="headingMd">Properties</Text>
                    <FormLayout>
                      {Object.entries(selectedElement.properties).map(([key, value]) => {
                        if (key === 'options' && Array.isArray(value)) {
                          return (
                            <BlockStack gap="3" key={key}>
                              <Text variant="headingSm">Options</Text>
                              {value.map((option, index) => (
                                <TextField
                                  key={index}
                                  value={option}
                                  onChange={(newValue) => {
                                    const newOptions = [...value];
                                    newOptions[index] = newValue;
                                    handlePropertyChange('options', newOptions);
                                  }}
                                />
                              ))}
                              <Button
                                onClick={() =>
                                  handlePropertyChange('options', [
                                    ...value,
                                    `Option ${value.length + 1}`,
                                  ])
                                }
                              >
                                Add Option
                              </Button>
                            </BlockStack>
                          );
                        }

                        if (typeof value === 'boolean') {
                          return (
                            <Checkbox
                              key={key}
                              label={key}
                              checked={value}
                              onChange={(checked) => handlePropertyChange(key, checked)}
                            />
                          );
                        }

                        return (
                          <TextField
                            key={key}
                            label={key}
                            value={value}
                            onChange={(newValue) => handlePropertyChange(key, newValue)}
                          />
                        );
                      })}
                    </FormLayout>
                  </BlockStack>
                </Box>
              </Card>
            )}

            <DragOverlay>
              {activeId ? (
                <Card>
                  <Box padding="3">
                    <Text variant="bodyMd">
                      {activeId.startsWith('sidebar-')
                        ? formFieldTypes[activeId.split('-')[1]]?.label
                        : formElements.find(item => item.id === activeId)?.properties.label
                      }
                    </Text>
                  </Box>
                </Card>
              ) : null}
            </DragOverlay>
          </DndContext>
        </BlockStack>
      </div>

      {/* Right Content Area */}
      <div style={{
        flex: 1,
        padding: 'var(--p-space-4)',
        overflowY: 'auto',
        height: '100%',
      }}>
        <BlockStack gap="4">
          <Text variant="headingXl">Form Builder</Text>

          <Card>
            <Box padding="4">
              <BlockStack gap="4">
                <Text variant="headingMd">Form Preview</Text>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <div
                    id="form-drop-area"
                    style={{
                      minHeight: '200px',
                      padding: 'var(--p-space-4)',
                      backgroundColor: formElements.length === 0 ? 'var(--p-color-bg-surface-secondary)' : 'transparent',
                      border: '2px dashed var(--p-color-border-secondary)',
                      borderRadius: 'var(--p-border-radius-2)',
                    }}
                  >
                    <SortableContext
                      items={formElements.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <BlockStack gap="4">
                        {formElements.map((element) => (
                          <SortableFormElement
                            key={element.id}
                            element={element}
                            onSelect={setSelectedElement}
                            isSelected={selectedElement?.id === element.id}
                          />
                        ))}
                        {formElements.length === 0 && (
                          <Box
                            padding="4"
                            background="bg-surface-secondary"
                            borderRadius="2"
                          >
                            <Text alignment="center" tone="subdued">
                              Drag form elements here to build your form
                            </Text>
                          </Box>
                        )}
                      </BlockStack>
                    </SortableContext>
                  </div>
                  <DragOverlay>
                    {activeId ? (
                      <Box padding="4">
                        <FormElementPreview
                          element={formElements.find(item => item.id === activeId) || {
                            type: activeId.split('-')[1],
                            properties: formFieldTypes[activeId.split('-')[1]]?.properties
                          }}
                        />
                      </Box>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </BlockStack>
            </Box>
          </Card>
        </BlockStack>
      </div>
    </div>
  );
};

export default FormBuilder;