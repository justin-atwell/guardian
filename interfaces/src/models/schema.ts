import { ISchemaDocument, SchemaDataTypes } from '../interface/schema-document.interface';
import { ISchema } from '../interface/schema.interface';
import { SchemaEntity } from '../type/schema-entity.type';
import { SchemaStatus } from '../type/schema-status.type';

export interface SchemaField {
    name: string;
    title?: string;
    description?: string;
    required: boolean;
    isArray: boolean;
    isRef: boolean;
    type: string;
    format?: string;
    pattern?: string;
    readOnly: boolean;
    fields?: SchemaField[];
    context?: {
        type: string;
        context: string;
    }
}

export class Schema {
    public static LOCAL_SCHEMA = 'https://localhost/schema';
    public id: string;
    public uuid: string;
    public hash: string;
    public name: string;
    public description: string;
    public entity: SchemaEntity;
    public status: SchemaStatus;
    public readonly: boolean;
    public document: string;
    public schema: ISchemaDocument;
    public fields: SchemaField[];
    public ref: string;
    public context: {
        type: string;
        context: string[];
    };

    constructor(data?: ISchema) {
        if (data) {
            this.id = data.id || "";
            this.uuid = data.uuid || Schema.randomUUID();
            this.hash = data.hash || "";
            this.name = data.name || "";
            this.description = data.description || "";
            this.entity = data.entity || SchemaEntity.NONE;
            this.status = data.status || SchemaStatus.DRAFT;
            this.readonly = data.readonly || false;

        } else {
            this.uuid = Schema.randomUUID();
            this.hash = "";
            this.id = "";
            this.status = SchemaStatus.DRAFT;
            this.readonly = false;
            this.name = "";
            this.description = "";
            this.entity = SchemaEntity.NONE;
        }
        if (data && data.document) {
            this.document = data.document;
            this.schema = JSON.parse(data.document);
            this.context = {
                type: this.getType(this.schema.$id),
                context: [Schema.LOCAL_SCHEMA]
            };
            this.getFields();
        } else {
            this.document = null;
            this.schema = null;
            this.ref = null;
            this.fields = [];
            this.context = null;
        }
    }

    private getId(type: string) {
        return `#${type}`;
    }

    private getType(ref: string) {
        if (ref) {
            const id = ref.split("#");
            return id[id.length - 1];
        }
        return ref;
    }

    private getUrl(type: string) {
        return `${Schema.LOCAL_SCHEMA}${type}`
    }

    private getComment(term: string, id: string) {
        return `{"term": "${term}", "@id": "${id}"}`
    }

    private getFields() {
        this.fields = [];
        this.ref = null;

        if (!this.schema || !this.schema.properties) {
            return;
        }

        this.ref = this.schema.$id;
        const required = {};
        if (this.schema.required) {
            for (let i = 0; i < this.schema.required.length; i++) {
                const element = this.schema.required[i];
                required[element] = true;
            }
        }

        const properties = Object.keys(this.schema.properties);
        for (let i = 0; i < properties.length; i++) {
            const name = properties[i];
            let property = this.schema.properties[name];
            if (property.readOnly) {
                continue;
            }
            if (property.oneOf && property.oneOf.length) {
                property = property.oneOf[0];
            }
            const title = property.title || name;
            const description = property.description || name;
            const isArray = property.type == SchemaDataTypes.array;
            if (isArray) {
                property = property.items;
            }
            const isRef = !!property.$ref;
            let type = String(property.type);
            let context = null;
            if (isRef) {
                type = property.$ref;
                context = {
                    type: this.getType(property.$ref),
                    context: [Schema.LOCAL_SCHEMA]
                }
            }
            const format = isRef || !property.format ? null : String(property.format);
            const pattern = isRef || !property.pattern ? null : String(property.pattern);
            const readOnly = !!property.readOnly;
            this.fields.push({
                name: name,
                title: title,
                description: description,
                type: type,
                format: format,
                pattern: pattern,
                required: !!required[name],
                isRef: isRef,
                isArray: isArray,
                readOnly: readOnly,
                fields: null,
                context: context
            })
        }
    }

    public update(fields?: SchemaField[]) {
        if (fields) {
            this.fields = fields;
        }
        if (!this.fields) {
            return null;
        }

        const document = {
            '$id': this.getId(this.uuid),
            '$comment': this.getComment(this.uuid, this.getUrl(this.getId(this.uuid))),
            'title': this.name,
            'description': this.description,
            'type': 'object',
            'properties': {
                '@context': {
                    'oneOf': [
                        { 'type': 'string' },
                        {
                            'type': 'array',
                            'items': { 'type': 'string' }
                        },
                    ],
                    'readOnly': true
                },
                'type': {
                    'oneOf': [
                        { 'type': 'string' },
                        {
                            'type': 'array',
                            'items': { 'type': 'string' }
                        },
                    ],
                    'readOnly': true
                },
                'id': {
                    'type': 'string',
                    'readOnly': true
                }
            },
            'required': ['@context', 'type'],
            'additionalProperties': false,
        }
        const properties = document.properties;
        const required = document.required;
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            field.title = field.title || field.name;
            field.description = field.description || field.name;
            if (!field.readOnly) {
                field.name = `field${i}`;
            }

            let item: any;
            let property: any;
            if (field.isArray) {
                item = {};
                property = {
                    'title': field.title,
                    'description': field.description,
                    'readOnly': !!field.readOnly,
                    'type': 'array',
                    'items': item
                }
            } else {
                item = {
                    'title': field.title,
                    'description': field.description,
                    'readOnly': !!field.readOnly
                };
                property = item;
            }
            if (field.isRef) {
                property.$comment = this.getComment(field.name, this.getUrl(field.type));
                item.$ref = field.type;
            } else {
                property.$comment = this.getComment(field.name, "https://www.schema.org/text");
                item.type = field.type;
                if (field.format) {
                    item.format = field.format;
                }
                if (field.pattern) {
                    item.pattern = field.pattern;
                }
            }
            if (field.required) {
                required.push(field.name);
            }
            properties[field.name] = property;
        }
        this.schema = document as any;
        this.document = JSON.stringify(document);
    }

    public static mapRef(data: ISchema[]): Schema[] {
        if (!data) {
            return null;
        }

        const ids: any = {};
        const schemes = data.map(e => new Schema(e));
        for (let i = 0; i < schemes.length; i++) {
            const schema = schemes[i];
            ids[schema.ref] = schema;
        }
        for (let i = 0; i < schemes.length; i++) {
            const schema = schemes[i];
            for (let j = 0; j < schema.fields.length; j++) {
                const field = schema.fields[j];
                if (field.isRef && ids[field.type]) {
                    field.fields = ids[field.type].fields;
                }
            }
        }
        return schemes;
    }

    public clone(): Schema {
        const clone = new Schema();
        clone.id = clone.id;
        clone.uuid = clone.uuid;
        clone.hash = clone.hash;
        clone.name = clone.name;
        clone.description = clone.description;
        clone.entity = clone.entity;
        clone.status = clone.status;
        clone.readonly = clone.readonly;
        clone.document = clone.document;
        clone.schema = clone.schema;
        clone.fields = clone.fields;
        clone.ref = clone.ref;
        clone.context = clone.context;
        return clone
    }

    public static randomUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    public static validate(schema: any) {
        try {
            if (!schema.name) {
                return false;
            }
            if (!schema.uuid) {
                return false;
            }
            if (!schema.document) {
                return false;
            }
            const doc = JSON.parse(schema.document);
            if (!doc.$id) {
                return false;
            }
        } catch (error) {
            return false;
        }
        return true;
    }
}
