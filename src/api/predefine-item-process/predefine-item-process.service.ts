import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { PredefineDto } from './dto/predefine-item-process.dto';
import { PredefineItemSearchDto } from './dto/predefine-item-process.search.dto';
import { BaseResponse } from 'src/common/base-response';
import { getCurrentDate } from 'src/utils/utils';
import { PredefineItemMachine } from 'src/entity/predefine-item-process.entity';
import * as PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';

@Injectable()
export class PredefineItemProcessService {
  constructor(
    @InjectRepository(PredefineItemMachine)
    private predefineRepository: Repository<PredefineItemMachine>,
    private commonService: CommonService,
  ) {}

  async getDropDownPredefindGroup() {
    const sql = `select distinct predefine_group from co_predefine where Predefine_Group in ('NG_Reason','Stop_Reason')   `;
    return await this.predefineRepository.query(sql);
  }

  async getDropDownPredefind() {
    const sql = `select Predefine_CD value ,Value_EN title from co_Predefine  WHERE  Predefine_Group   in ('NG_Reason','Stop_Reason') `;
    return await this.predefineRepository.query(sql);
  }

  async getDropDownPredefindItem(group, predefineCd) {
    const sql = `select  Predefine_Item_CD value, Value_EN title from co_Predefine_item where  Predefine_Group= '${group}' and Predefine_CD = '${predefineCd}'`;
    return await this.predefineRepository.query(sql);
  }

  async getDropDownMachineProcess() {
    const sql = `select Process_CD value , Process_CD title from  M_Machine`;
    return await this.predefineRepository.query(sql);
  }

  async search(dto: PredefineItemSearchDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Predefine_Group', dto.predefineGroup);
      req.input('Predefine_CD', dto.predefineCd);
      req.input('Process_CD', dto.processCd);
      req.input('Value_TH', dto.valueTH);
      req.input('Value_EN', dto.valueEN);
      req.input('Is_Active', dto.isActive);
      req.input('Language', 'EN');
      req.input('Row_No_From', dto.searchOptions.rowFrom);
      req.input('Row_No_To', dto.searchOptions.rowTo);

      return await this.commonService.getSearch(
        'sp_co_Search_Predefine_Item_Machine',
        req,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(
    processCd: string,
    predefineItemCd: string,
  ): Promise<PredefineItemMachine> {
    const predefine = await this.predefineRepository.findOne({
      where: { processCd: processCd, predefineItemCd },
    });
    if (!predefine) {
      throw new NotFoundException(`Item not found`);
    }
    return predefine;
  }

  async create(dto: PredefineDto, userId): Promise<BaseResponse> {
    try {
      dto.createBy = userId;
      dto.updateBy = userId;
      dto.createDate = getCurrentDate();
      dto.updateDate = getCurrentDate();

      console.log('Create Predefine item process', dto);
      const dbData = await this.predefineRepository.findOneBy({
        predefineItemCd: dto.predefineItemCd,
        processCd: dto.processCd,
      });
      if (dbData) {
        return {
          status: 1,
          message: 'Item already exists',
        };
      }

      console.log('before called ');

      await this.predefineRepository.insert(dto);

      return {
        status: 0,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(
    processCd: string,
    predefineItemCd: string,
    predefineDto: PredefineDto,
    userId: number,
  ): Promise<BaseResponse> {
    console.log('Update predefine process: ', predefineDto);
    const team = await this.predefineRepository.findOneBy({
      predefineItemCd: predefineDto.predefineItemCd,
      processCd: predefineDto.processCd,
    });
    if (team) {
      if (
        team.processCd !== processCd ||
        team.predefineItemCd !== predefineItemCd
      ) {
        return {
          status: 2,
          message: 'Item already exists',
        };
      }
    }

    const result = await this.predefineRepository.update(
      {
        processCd: processCd,
        predefineItemCd: predefineItemCd,
      },
      {
        predefineGroup: predefineDto.predefineGroup,
        predefineCd: predefineDto.predefineCd,
        predefineItemCd: predefineDto.predefineItemCd,
        processCd: predefineDto.processCd,
        isActive: predefineDto.isActive,
        updateBy: userId,
        updateDate: getCurrentDate(),
      },
    );
    console.log('result', result);

    if (!result) {
      return {
        status: 1,
        message: `Predefine item not found`,
      };
    }
    return {
      status: 0,
    };
  }

  async export(
    lineCd: string = 'CYH#6',
    predefineGroup?: string,
    predefineCd?: string,
    processCd?: string,
    valueEN?: string,
    valueTH?: string,
    isActive?: string,
  ): Promise<Buffer> {
    try {
      const req = await this.commonService.getConnection();
      req.input('Line_CD', lineCd);
      req.input('Predefine_Group', predefineGroup);
      req.input('Predefine', predefineCd);
      req.input('Process_CD', processCd);
      req.input('Value_EN', valueEN);
      req.input('Value_TH', valueTH);
      req.input('Is_Active', isActive);

      const result = await this.commonService.executeStoreProcedure(
        'sp_rp_reason_process',
        req,
      );
      const data = result.recordset || [];
      console.log('Export result:', data);

      // const testData = [
      //   {
      //     Type: 'SL',
      //     Reason_EN: 'Blow Hole',
      //     Reason_TH: 'Blow Hole',
      //     Process_CD: 'OP10',
      //     Predefine_Group: 'Stop_Reason',
      //     Reason_ID: '1',
      //     Machine_No: 'J76',
      //   },
      //   {
      //     Type: 'SL',
      //     Reason_EN: 'Blow Hole',
      //     Reason_TH: 'Blow Hole',
      //     Process_CD: 'OP11',
      //     Predefine_Group: 'Stop_Reason',
      //     Reason_ID: '1',
      //     Machine_No: 'J85',
      //   },
      //   {
      //     Type: 'NG',
      //     Reason_EN: 'Blow Hole',
      //     Reason_TH: 'Blow Hole',
      //     Process_CD: 'OP101',
      //     Predefine_Group: 'NG_Reason',
      //     Reason_ID: '1',
      //     Machine_No: 'J86',
      //   },
      //   {
      //     Type: 'NG',
      //     Reason_EN: 'Dimension NG',
      //     Reason_TH: 'Dimension NG ',
      //     Process_CD: 'OP101',
      //     Predefine_Group: 'NG_Reason',
      //     Reason_ID: '19',
      //     Machine_No: 'J88',
      //   },
      //   {
      //     Type: 'NG',
      //     Reason_EN: 'Leak',
      //     Reason_TH: 'Leak',
      //     Process_CD: 'OP101',
      //     Predefine_Group: 'NG_Reason',
      //     Reason_ID: '2',
      //     Machine_No: 'J82',
      //   },
      //   {
      //     Type: 'NG',
      //     Reason_EN: 'Other',
      //     Reason_TH: 'Other',
      //     Process_CD: 'OP101',
      //     Predefine_Group: 'NG_Reason',
      //     Reason_ID: '4',
      //     Machine_No: 'J84',
      //   },
      // ];

      // Generate PDF with QR codes
      return await this.generatePdfWithQRCodes(
        data || [],
        predefineGroup,
        lineCd,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async generatePdfWithQRCodes(
    data: any[],
    predefineGroup?: string,
    lineCd?: string,
  ): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Dynamic title based on predefineGroup
        let title = 'QR Code Downtime List';
        if (predefineGroup === 'NG_Reason') {
          title = `QR Code (NG List For ${lineCd || 'N/A'})`;
        } else {
          title = `QR Code (Line Stop List For ${lineCd || 'N/A'})`;
        }

        // Add title
        doc.fontSize(20).text(title, { align: 'center' });

        // Add underline below title
        const titleWidth = doc.widthOfString(title);
        const pageWidth = doc.page.width - 100; // Account for margins
        const titleX = (pageWidth - titleWidth) / 2 + 50; // Center the underline
        doc
          .moveTo(titleX, doc.y)
          .lineTo(titleX + titleWidth, doc.y)
          .stroke();

        doc.moveDown(2);

        // Group data by Predefine_Group first, then by Process_CD within each group
        const groupedByPredefineGroup = this.groupDataByPredefineGroup(data);
        const predefineGroups = Object.keys(groupedByPredefineGroup);

        const qrSize = 80;
        const cellWidth = 100;
        const cellHeight = 130; // Reduced height for shorter rows
        const processCdWidth = 60; // Reduced width for Process_CD cell to fit text
        const qrCodesPerRow = 4; // 4 QR codes per row after the Process_CD
        const maxRowsPerPage = 4; // Maximum 4 rows per page

        // Function to add header on new page
        const addHeader = (groupTitle: string) => {
          doc.fontSize(20).text(groupTitle, { align: 'center' });

          // Add underline below title
          const titleWidth = doc.widthOfString(groupTitle);
          const pageWidth = doc.page.width - 100;
          const titleX = (pageWidth - titleWidth) / 2 + 50;
          doc
            .moveTo(titleX, doc.y)
            .lineTo(titleX + titleWidth, doc.y)
            .stroke();

          doc.moveDown(2);
          return doc.y;
        };

        let isFirstGroup = true;

        // Process each Predefine_Group
        for (const predefineGroup of predefineGroups) {
          const groupData = groupedByPredefineGroup[predefineGroup];

          // Create group-specific title
          let groupTitle = 'QR Code Downtime List';
          if (predefineGroup === 'NG_Reason') {
            groupTitle = `QR Code (NG List For ${lineCd || 'N/A'})`;
          } else if (predefineGroup === 'Stop_Reason') {
            groupTitle = `QR Code (Line Stop List For ${lineCd || 'N/A'})`;
          }

          // Start new page for each group (except the first one)
          if (!isFirstGroup) {
            doc.addPage();
          }

          let yPosition = isFirstGroup ? doc.y : addHeader(groupTitle);
          let currentRowCount = 0;
          isFirstGroup = false;

          // Group this group's data by Process_CD
          const groupedData = this.groupDataByProcess(groupData);
          const processCodes = Object.keys(groupedData);

          // Draw each process as a row within this group
          for (const processCode of processCodes) {
            const processItems = groupedData[processCode];

            // Process each batch of QR codes for this process
            for (
              let startIndex = 0;
              startIndex < processItems.length;
              startIndex += qrCodesPerRow
            ) {
              const endIndex = Math.min(
                startIndex + qrCodesPerRow,
                processItems.length,
              );
              const rowItems = processItems.slice(startIndex, endIndex);

              // Draw Process_CD in the first cell
              const processXPosition = 50;

              // Draw border around Process_CD cell
              doc
                .rect(
                  processXPosition - 5,
                  yPosition - 5,
                  processCdWidth + 10,
                  cellHeight + 10,
                )
                .stroke();

              // Add Process_CD text (centered vertically and horizontally)
              doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('black')
                .text(
                  processCode,
                  processXPosition,
                  yPosition + cellHeight / 2 - 6,
                  {
                    width: processCdWidth,
                    align: 'center',
                  },
                );

              // Draw QR codes for this row
              for (let i = 0; i < qrCodesPerRow; i++) {
                const xPosition =
                  50 + processCdWidth + 10 + i * (cellWidth + 10); // Position after Process_CD cell

                // Draw border around QR cell (always draw the cell)
                doc
                  .rect(
                    xPosition - 5,
                    yPosition - 5,
                    cellWidth + 10,
                    cellHeight + 10,
                  )
                  .stroke();

                // Check if we have data for this position
                if (i < rowItems.length) {
                  const item = rowItems[i];

                  // Generate QR code content: Type|Process_CD|Reason_ID
                  const qrContent = `${item.Type || 'N/A'}|${item.Process_CD || 'N/A'}|${item.Reason_ID || 'N/A'}`;

                  try {
                    // Generate QR code as data URL
                    const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
                      width: qrSize,
                      margin: 1,
                      color: {
                        dark: '#000000',
                        light: '#FFFFFF',
                      },
                    });

                    // Convert data URL to buffer
                    const base64Data = qrCodeDataURL.replace(
                      /^data:image\/png;base64,/,
                      '',
                    );
                    const qrBuffer = Buffer.from(base64Data, 'base64');

                    // Add Machine_No at the top
                    doc
                      .fontSize(8)
                      .font('Helvetica-Bold')
                      .text(
                        `${item.Machine_No || 'N/A'}`,
                        xPosition,
                        yPosition + 5,
                        {
                          width: cellWidth,
                          align: 'center',
                        },
                      );

                    // Add Reason_TH below Machine_No
                    doc
                      .fontSize(8)
                      .font('Helvetica')
                      .text(
                        `${item.Reason_TH || 'N/A'}`,
                        xPosition,
                        yPosition + 18,
                        {
                          width: cellWidth,
                          align: 'center',
                        },
                      );

                    // Add QR code image in the middle
                    const qrY = yPosition + 35;
                    doc.image(qrBuffer, xPosition + 10, qrY, {
                      width: qrSize,
                      height: qrSize,
                    });

                    // Add Reason_EN at the bottom
                    doc
                      .fontSize(8)
                      .font('Helvetica')
                      .text(
                        `${item.Reason_EN || 'N/A'}`,
                        xPosition,
                        qrY + qrSize + 5,
                        {
                          width: cellWidth,
                          align: 'center',
                        },
                      );
                  } catch (qrError) {
                    console.error(
                      'Error generating QR code for item:',
                      item,
                      qrError,
                    );
                  }
                }
                // If i >= rowItems.length, the cell remains empty but still has a border
              }

              yPosition += cellHeight + 10;
              currentRowCount++; // Check if we need a new page (after 4 rows)
              if (currentRowCount >= maxRowsPerPage) {
                doc.addPage();
                yPosition = addHeader(groupTitle);
                currentRowCount = 0;
              }
            }
          }
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private groupDataByPredefineGroup(data: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};

    data.forEach((item) => {
      const predefineGroup = item.Predefine_Group || 'N/A';
      if (!grouped[predefineGroup]) {
        grouped[predefineGroup] = [];
      }
      grouped[predefineGroup].push(item);
    });

    return grouped;
  }

  private groupDataByProcess(data: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};

    data.forEach((item) => {
      const processCode = item.Process_CD || 'N/A';
      if (!grouped[processCode]) {
        grouped[processCode] = [];
      }
      grouped[processCode].push(item);
    });

    return grouped;
  }
}
