import {IEnum} from "./enum";

export const TYPES_LIST: IEnum[] = [{
    enum: 'FROM',
    display: 'From'
},
{
    enum: 'TO',
    display: 'To'
},
{
    enum: 'SUBJECT',
    display: 'Subject'
},
{
    enum: 'BODY',
    display: 'Body'
},
{
    enum: 'ATTACH',
    display: 'Attach'
}];

export const COMPARISON_LIST: IEnum[] = [{
    enum: 'EQUALS',
    display: 'Equals'
},
{
    enum: 'CONTAINS',
    display: 'Contains'
}];

export const FINAL_ACTION_LIST: IEnum[] = [{
    enum: 'MARK_READ',
    display: 'Mark as read'
},
{
    enum: 'DELETE',
    display: 'Delete'
},
{
    enum: 'MOVE_TO_FOLDER',
    display: 'Move to another folder:'
}];

