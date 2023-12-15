export type AnnotationType = {
  tooth_no: number;
  tooth_position: string;
  annotations: {
    key: number;
    procedure_id: string;
    geometry: {
      height: number;
      type: string;
      width: number;
      x: number;
      y: number;
    };
    data: {
      color: string;
      description: string;
      icon: string;
      title: string;
    };
  }[];
};
