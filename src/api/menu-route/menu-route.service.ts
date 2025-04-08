import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuRoute } from 'src/entity/menu-route.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MenuRouteService {
  constructor(
    @InjectRepository(MenuRoute)
    private repository: Repository<MenuRoute>,
  ) {}

  async getMenuRoutePermission(): Promise<MenuRoute[]> {
    return this.repository.find();
  }

  async getByMenuNo(menuNo: string): Promise<MenuRoute[]> {
    return this.repository.findBy({ menuNo });
  }

  add(data: MenuRoute): Promise<MenuRoute> {
    return this.repository.save(data);
  }

  async update(data: MenuRoute): Promise<boolean> {
    console.log(data);
    const r = await this.repository.update(
      { menuRouteId: data.menuRouteId },
      {
        routeName: data.routeName,
        routePath: data.routePath,
        physicalPath: data.physicalPath,
        isRequireAuth: data.isRequireAuth,
      },
    );

    return r.affected > 0;
  }

  async delete(menuRouteId: number): Promise<boolean> {
    const r = await this.repository.delete({ menuRouteId: menuRouteId });
    return r.affected > 0;
  }
}
