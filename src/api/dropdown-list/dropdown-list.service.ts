import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Predefine } from 'src/entity/predefine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DropdownListService {
  constructor(
    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,
  ) { }

  async getPredefindAll() {
    // const sql = `select predefine_group , predefine_group + ' : ' + display as display from (select predefine_group, max(Value_EN) display from co_predefine   group by predefine_group) x`;
    const sql = `select distinct predefine_group from co_predefine   `;
    return await this.predefineRepository.query(sql);
    // return this.predefineRepository.findBy({Predefine_Group : group , Is_Active : 'Y'});
  }

  async getPredefileByGroup(group: string) {
    const sql = `SELECT predefine_group, predefine_cd as value, case when 'EN' = 'TH' then Value_TH else Value_EN end as title
    ,predefine_cd , Value_TH , Value_EN
    FROM co_predefine WHERE predefine_group = '${group}' and is_active = 'Y'`;
    return await this.predefineRepository.query(sql);
    // return this.predefineRepository.findBy({Predefine_Group : group , Is_Active : 'Y'});
  }

  async getPredefine(group: string, language: string) {
    const sql = `SELECT predefine_group, predefine_cd as value, case when '${language}' = 'TH' then Value_TH else Value_EN end as title 
    ,predefine_cd , Value_TH , Value_EN
    FROM co_predefine WHERE predefine_group = '${group}' and is_active = 'Y'   `;
    return await this.predefineRepository.query(sql);
    // return this.predefineRepository.findBy({Predefine_Group : group , Is_Active : 'Y'});
  }

  async getPredefineItem(group: string, search: string = '', language: string = 'EN') {
    const sql = `SELECT predefine_group, Predefine_Item_CD as value, case when '${language}' = 'TH' then Value_TH else Value_EN end as title 
    FROM co_Predefine_Item WHERE predefine_group = '${group}' and is_active = 'Y' and Value_EN like '%${search}%'  `;
    return await this.predefineRepository.query(sql);
  }
  
  async getMenu(language: string) {
    const menus = [{ value: '', text: 'ROOT' }];
    const col = language === 'EN' ? 'Menu_Name_EN' : 'Menu_Name_TH';
    let qry = `SELECT Menu_No as value , ${col} as  text FROM um_menu where Main_Menu_No  is null`;
    const root_menu = await this.predefineRepository.query(qry);
    if (typeof root_menu !== 'undefined') {
      for (let i = 0; i < root_menu.length; i++) {
        const main = root_menu[i];
        menus.push(main);

        qry = `SELECT Menu_No as value , ' - ' + ${col} as  text FROM um_menu where Main_Menu_No  = '${main.value}'`;
        const childMenu = await this.predefineRepository.query(qry);
        if (typeof childMenu !== 'undefined') {
          for (let j = 0; j < childMenu.length; j++) {
            const cm = childMenu[j];
            menus.push(cm);
          }
        }
      }
    }
    return menus;
  }

  // Overload signatures
  async getDropdownList(
    tableName: string,
    colValue: string,
    colText: string,
  ): Promise<any[]>;
  async getDropdownList(
    tableName: string,
    colValue: string,
    colText: string,
    whereCondition: string,
  ): Promise<any[]>;
  async getDropdownList(
    tableName: string,
    colValue: string,
    colText: string,
    whereCondition: string,
    orderby: string,
  ): Promise<any[]>;
  async getDropdownList(
    tableName: string,
    colValue: string,
    colText: string,
    whereCondition: string,
    orderby: string,
    columns?: Array<string>,
  ): Promise<any[]>;

  // Implementation that matches all the above signatures
  async getDropdownList(
    tableName: string,
    colValue: string,
    colText: string,
    whereCondition?: string,
    orderby?: string,
    columns?: Array<string>,
  ): Promise<any[]> {
    let data = [];

    let c = '';
    if (columns && columns.length > 0) {
      c = columns.join(',');
      if (c.length > 0) {
        c = ',' + c;
      }
    }

    let sql = `SELECT ${colValue} as col_value, ${colText} as col_text ${c}  FROM ${tableName}`;

    if (whereCondition) {
      sql += ' WHERE 1 = 1 AND ' + whereCondition;
    }

    if (orderby) {
      sql += ' ORDER BY ' + orderby; // Fixed to use `orderby` instead of `whereCondition`
    }

    let result = await this.predefineRepository.query(sql);
    for (let i = 0; i < result.length; i++) {
      data.push({
        value: `${result[i]['col_value']}`,
        title: `${result[i]['col_text']}`,
        ...result[i],
      });
    }

    return data;
  }
}
