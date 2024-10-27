// formSelectorTemplates.ts
import {
    TextBlockMajor,
    SelectMajor,
    EmailMajor,
    PhoneMajor,
    CalendarMajor,
    CheckboxMajor,
    TextAlignmentLeftMajor,
    ColorsMajor,
    RadioButtonMajor,
    UploadMajor,
    ListMajor,
    HashtagMajor,
    TypeMajor,
    ButtonMinor,
    LinkMinor,
} from '@shopify/polaris-icons';

export const formFieldTypes = {
    // Text Input Types
    TEXT: {
        type: 'text',
        icon: TextBlockMajor,
        label: 'Text Field',
        category: 'basic',
        properties: {
            label: 'Text Field',
            placeholder: 'Enter text',
            helpText: '',
            required: false,
            disabled: false,
            defaultValue: '',
            validation: {
                minLength: 0,
                maxLength: 100,
                pattern: '',
            }
        },
    },

    TEXTAREA: {
        type: 'textarea',
        icon: TextAlignmentLeftMajor,
        label: 'Text Area',
        category: 'basic',
        properties: {
            label: 'Text Area',
            placeholder: 'Enter long text',
            helpText: '',
            required: false,
            disabled: false,
            rows: 4,
            defaultValue: '',
            validation: {
                minLength: 0,
                maxLength: 1000,
            }
        },
    },

    // Contact Information
    EMAIL: {
        type: 'email',
        icon: EmailMajor,
        label: 'Email Field',
        category: 'contact',
        properties: {
            label: 'Email',
            placeholder: 'Enter email address',
            helpText: 'Please enter a valid email address',
            required: true,
            disabled: false,
            defaultValue: '',
            validation: {
                pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            }
        },
    },

    PHONE: {
        type: 'tel',
        icon: PhoneMajor,
        label: 'Phone Field',
        category: 'contact',
        properties: {
            label: 'Phone Number',
            placeholder: 'Enter phone number',
            helpText: 'Enter your phone number with country code',
            required: false,
            disabled: false,
            format: '(###) ###-####',
            validation: {
                pattern: '^\\+?[1-9]\\d{1,14}$',
            }
        },
    },

    // Selection Types
    SELECT: {
        type: 'select',
        icon: SelectMajor,
        label: 'Select Field',
        category: 'selection',
        properties: {
            label: 'Select Option',
            options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
            ],
            helpText: 'Select one option',
            required: false,
            disabled: false,
            defaultValue: '',
            allowMultiple: false,
        },
    },

    RADIO: {
        type: 'radio',
        icon: RadioButtonMajor,
        label: 'Radio Group',
        category: 'selection',
        properties: {
            label: 'Radio Options',
            options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
            ],
            helpText: 'Select one option',
            required: false,
            disabled: false,
            defaultValue: '',
            layout: 'vertical', // or 'horizontal'
        },
    },

    CHECKBOX_GROUP: {
        type: 'checkbox-group',
        icon: ListMajor,
        label: 'Checkbox Group',
        category: 'selection',
        properties: {
            label: 'Checkbox Options',
            options: [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
            ],
            helpText: 'Select multiple options',
            required: false,
            disabled: false,
            defaultValue: [],
            layout: 'vertical', // or 'horizontal'
        },
    },

    CHECKBOX: {
        type: 'checkbox',
        icon: CheckboxMajor,
        label: 'Single Checkbox',
        category: 'selection',
        properties: {
            label: 'I agree to the terms',
            helpText: 'Please agree to continue',
            required: false,
            disabled: false,
            checked: false,
        },
    },

    // Date & Time
    DATE: {
        type: 'date',
        icon: CalendarMajor,
        label: 'Date Field',
        category: 'datetime',
        properties: {
            label: 'Select Date',
            helpText: 'Choose a date',
            required: false,
            disabled: false,
            format: 'YYYY-MM-DD',
            minDate: '',
            maxDate: '',
            defaultValue: '',
        },
    },

    // Numbers & Currency
    NUMBER: {
        type: 'number',
        icon: HashtagMajor,
        label: 'Number Field',
        category: 'numeric',
        properties: {
            label: 'Number',
            placeholder: 'Enter a number',
            helpText: '',
            required: false,
            disabled: false,
            defaultValue: '',
            validation: {
                min: 0,
                max: 100,
                step: 1,
            }
        },
    },

    // File Uploads
    FILE: {
        type: 'file',
        icon: UploadMajor,
        label: 'File Upload',
        category: 'advanced',
        properties: {
            label: 'Upload File',
            helpText: 'Select files to upload',
            required: false,
            disabled: false,
            multiple: false,
            acceptedTypes: '.pdf,.doc,.docx,.txt',
            maxSize: 5, // in MB
            maxFiles: 1,
        },
    },

    // Rich Text
    RICH_TEXT: {
        type: 'rich-text',
        icon: TypeMajor,
        label: 'Rich Text Editor',
        category: 'advanced',
        properties: {
            label: 'Rich Text',
            placeholder: 'Enter formatted text',
            helpText: '',
            required: false,
            disabled: false,
            defaultValue: '',
            toolbar: ['bold', 'italic', 'link', 'list'],
            height: 200,
        },
    },

    // UI Elements
    BUTTON: {
        type: 'button',
        icon: ButtonMinor,
        label: 'Button',
        category: 'ui',
        properties: {
            label: 'Submit',
            variant: 'primary', // primary, secondary, plain
            tone: 'base', // base, critical, success, warning
            disabled: false,
            fullWidth: false,
            size: 'medium', // small, medium, large
            type: 'submit', // submit, button, reset
        },
    },

    LINK: {
        type: 'link',
        icon: LinkMinor,
        label: 'Link',
        category: 'ui',
        properties: {
            label: 'Click here',
            url: '#',
            openInNewTab: false,
            disabled: false,
            underline: true,
        },
    },
};

export const fieldCategories = [
    {
        id: 'basic',
        label: 'Basic Fields',
        description: 'Common form elements for basic data collection',
    },
    {
        id: 'contact',
        label: 'Contact Information',
        description: 'Fields for collecting contact details',
    },
    {
        id: 'selection',
        label: 'Selection Fields',
        description: 'Fields for choosing from options',
    },
    {
        id: 'datetime',
        label: 'Date & Time',
        description: 'Fields for date and time selection',
    },
    {
        id: 'numeric',
        label: 'Numbers & Currency',
        description: 'Fields for numerical input',
    },
    {
        id: 'advanced',
        label: 'Advanced',
        description: 'Complex form elements for specific needs',
    },
    {
        id: 'ui',
        label: 'UI Elements',
        description: 'Interactive interface elements',
    },
];

export const commonValidationRules = {
    required: {
        message: 'This field is required',
    },
    email: {
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        message: 'Please enter a valid email address',
    },
    phone: {
        pattern: '^\\+?[1-9]\\d{1,14}$',
        message: 'Please enter a valid phone number',
    },
    url: {
        pattern: 'https?://.+',
        message: 'Please enter a valid URL',
    },
    number: {
        pattern: '^[0-9]+$',
        message: 'Please enter a valid number',
    },
};

// Sample form templates
export const formTemplates = {
    CONTACT: {
        id: 'contact-form',
        name: 'Contact Form',
        description: 'Basic contact information collection form',
        fields: [
            { type: 'text', properties: { label: 'Full Name', required: true } },
            { type: 'email', properties: { label: 'Email Address', required: true } },
            { type: 'tel', properties: { label: 'Phone Number' } },
            { type: 'textarea', properties: { label: 'Message', rows: 4 } },
        ],
    },
    SURVEY: {
        id: 'survey-form',
        name: 'Survey Form',
        description: 'Customer feedback collection form',
        fields: [
            {
                type: 'radio', properties: {
                    label: 'How satisfied are you?', options: [
                        { label: 'Very Satisfied', value: '5' },
                        { label: 'Satisfied', value: '4' },
                        { label: 'Neutral', value: '3' },
                        { label: 'Dissatisfied', value: '2' },
                        { label: 'Very Dissatisfied', value: '1' },
                    ]
                }
            },
            { type: 'checkbox-group', properties: { label: 'What features do you use?' } },
            { type: 'textarea', properties: { label: 'Additional Comments' } },
        ],
    },
    REGISTRATION: {
        id: 'registration-form',
        name: 'Registration Form',
        description: 'User registration form',
        fields: [
            { type: 'text', properties: { label: 'Username', required: true } },
            { type: 'email', properties: { label: 'Email', required: true } },
            { type: 'text', properties: { label: 'Password', required: true } },
            { type: 'checkbox', properties: { label: 'I agree to the terms', required: true } },
        ],
    },
};