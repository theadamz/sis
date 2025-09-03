/*** Enums ***/
export enum DateDefault {
    DATE = 'yyyy-MM-dd',
    TIME = 'HH:mm:ss',
    DATE_TIME = 'yyyy-MM-dd HH:mm:ss',
}

export enum InspectionFlow {
    IN = 'IN',
    OUT = 'OUT',
}

export enum InspectionStage {
    CHECKED_IN = 'CHECKED_IN',
    LOADING = 'LOADING',
    CHECKED_OUT = 'CHECKED_OUT',
}

export enum InspectionStageVariant {
    CHECKED_IN = 'info',
    LOADING = 'warning',
    CHECKED_OUT = 'default',
}

export enum InspectionStageLabel {
    CHECKED_IN = 'Checked In',
    LOADING = 'Loading',
    CHECKED_OUT = 'Checked Out',
}

export const getInspectionStage = (value: string, type: 'value' | 'label' | 'variant' = 'value') => {
    // get key stage
    const stage = Object.keys(InspectionStage)[Object.values(InspectionStage).indexOf(value as InspectionStage)];

    switch (type) {
        case 'variant':
            return InspectionStageVariant[stage as keyof typeof InspectionStageVariant];
        case 'label':
            return InspectionStageLabel[stage as keyof typeof InspectionStageLabel];
        default:
            return InspectionStage[stage as keyof typeof InspectionStage];
    }
};

export enum InspectionItemType {
    SELECT = 'SELECT', // only ok/no
    PHOTO = 'PHOTO',
    SELECT_PHOTO = 'SELECT_PHOTO',
}
