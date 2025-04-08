import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Menu } from 'src/entity/menu.entity';
import { Repository } from 'typeorm';
import { MenuSearchDto } from './dto/menu/menu-search.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    private commonService: CommonService,
  ) {}

  getByID(menuNo: string): Promise<Menu> {
    return this.menuRepository.findOneBy({ menuNo });
  }

  async search(dto: MenuSearchDto) {
    const req = await this.commonService.getConnection();
    req.input('Menu_No', dto.menu_no);
    req.input('Menu_Name', dto.menu_name);
    req.input('Status', dto.status);
    req.input('Language', 'TH');
    return this.commonService.getSearch('sp_um_Search_Menu', req);
  }

  addMenu(data: Menu): Promise<Menu> {
    data.createdDate = new Date();
    data.updatedDate = new Date();
    return this.menuRepository.save(data);
  }

  async updateMenu(data: Menu): Promise<boolean> {
    console.log(data);
    const r = await this.menuRepository.update(
      { menuNo: data.menuNo },
      {
        menuNameTH: data.menuNameTH,
        menuNameEN: data.menuNameEN,
        url: data.url,
        menuGroup: data.menuGroup,
        isMainMenu: data.isMainMenu,
        isActive: data.isActive,
        updatedBy: data.updatedBy,
        menuSeq: data.menuSeq,
        updatedDate: new Date(),
      },
    );

    return r.affected > 0;
  }

  async deleteMenu(Menu_No: string): Promise<boolean> {
    const r = await this.menuRepository.delete({ menuNo: Menu_No });
    return r.affected > 0;
  }

  async getMainMenu(Role_ID: number) {
    return await this.menuRepository.query('EXEC sp_um_Load_MenuRole @0, @1', [
      'EN',
      Role_ID,
    ]);
  }
}
