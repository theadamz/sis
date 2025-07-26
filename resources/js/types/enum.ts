/*** Enums ***/
export enum DateDefault {
    DATE = 'yyyy-MM-dd',
    TIME = 'HH:mm:ss',
    DATE_TIME = 'yyyy-MM-dd HH:mm:ss',
}

export enum InspectionType {
    LOADING = 'loading',
    UNLOADING = 'unloading',
}

export enum Stage {
    CHECKED_IN = 'checkedin',
    LOADING = 'loading',
    CHECKED_OUT = 'checkedout',
}

export enum StageVariant {
    CHECKED_IN = 'info',
    LOADING = 'warning',
    CHECKED_OUT = 'default',
}

export enum StageLabel {
    CHECKED_IN = 'Checked In',
    LOADING = 'Loading',
    CHECKED_OUT = 'Checked Out',
}

export const getStage = (value: string, type: 'value' | 'label' | 'variant' = 'value') => {
    // get key stage
    const stage = Object.keys(Stage)[Object.values(Stage).indexOf(value as Stage)];

    switch (type) {
        case 'variant':
            return StageVariant[stage as keyof typeof StageVariant];
        case 'label':
            return StageLabel[stage as keyof typeof StageLabel];
        default:
            return Stage[stage as keyof typeof Stage];
    }
};

export enum CheckType {
    SELECT = 'select', // only ok/no
    PHOTO = 'photo',
}
