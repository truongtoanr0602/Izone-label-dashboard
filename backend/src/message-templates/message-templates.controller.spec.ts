import { BadRequestException } from '@nestjs/common';
import { MessageTemplatesController } from './message-templates.controller';

describe('MessageTemplatesController', () => {
  it('rejects a non-numeric template id before calling the service', () => {
    const service = { update: jest.fn() };
    const controller = new MessageTemplatesController(service as never);

    expect(() => controller.update({} as never, 'not-a-number', {})).toThrow(BadRequestException);
    expect(service.update).not.toHaveBeenCalled();
  });
});
