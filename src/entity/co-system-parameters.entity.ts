import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('co_system_parameters')
export class CoSystemParameters {
  @PrimaryColumn({ name: 'param_type' })
  paramType: string;

  @Column({ name: 'param_value' })
  paramValue: string;

  @Column({ name: 'description' })
  description: string;
}
