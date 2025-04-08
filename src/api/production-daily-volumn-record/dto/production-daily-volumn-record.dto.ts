import { BaseDto } from 'src/common/base-dto';

export class ProductionDailyVolumnRecordDto extends BaseDto {
  prodDailyId: number;
  date: string;
  line: string;
  grade: string;
  productName: string;
  filename: string;
  filedata: string;

  shifts: ProductionDailyVolumnRecordShift[];
}

export class ProductionDailyVolumnRecordShift {
  Shift: string;
  Shift_Oper_Time: string;
  Shift_Start: string;
  Shift_End: string;
  T1_Production_CBO: string;
  T1_Production_EBO: string;
  T1_Production_FCC: string;
  T1_Production_Prod_Total: string;
  T1_EKINEN_CBO: string;
  T1_EKINEN_EBO: string;
  T1_EKINEN_FCC: string;
  T1_EKINEN_EKN_Total: string;

  T1_PRODUCTION_EKINEN_EBO: string;
  T1_PRODUCTION_EKINEN_CBO: string;
  T1_PRODUCTION_EKINEN_FCC: string;
  T1_PRODUCTION_EKINEN_Total: string;

  T2_NG_Production: string;
  T2_NG_Production_Total: string;
  T2_NG_Warm_up: string;
  T2_NG_Warm_up_Total: string;
  T2_NG_Preheat: string;
  T2_EBO_Preheat: string;
  T2_CBO_Preheat: string;
  T2_FCC_Preheat: string;
  T2_Preheat_Total: string;
  T2_NG_Drying: string;
  T2_NG_Drying_Total: string;
  T2_NG_Oil_Spray_checking: string;
  T2_NG_Oil_Spray_checking_Total: string;

  T3_Mixing_Other: string;
  T3_Hoist_Other: string;
  T3_Kande_Other: string;
  T3_Total_Mixing_Volume_Other: string;
  T3_Discharged_Volume_Other: string;

  T3_KOH_Mixing_Other: string;
  T3_NaOH_Consumption_Other: string;
  T3_Recycle_Hopper_Level_Other: string;

  storageTanks: ProductionDailyVolumnStorageTank[];
}

export class ProductionDailyVolumnStorageTank {
  Shift: string;
  Tank: string;
  Tank_Start_Time: string;
  Tank_Stop_Time: string;
  Reason: string;
  Full_Tank: string;
}
