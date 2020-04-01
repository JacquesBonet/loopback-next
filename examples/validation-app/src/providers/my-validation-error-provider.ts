import {HandlerContext, HttpErrors, RejectProvider} from '@loopback/rest';

export class MyValidationErrorProvider extends RejectProvider {
  value() {
    // Use the lambda syntax to preserve the "this" scope for future calls!
    return (response: HandlerContext, result: Error) => {
      this.action(response, result);
    };
  }

  action({request, response}: HandlerContext, error: Error) {
    // handle the error and send back the error response
    // "response" is an Express Response object
    response.setHeader('Content-Type', 'application/json');
    const httpError = <HttpErrors.HttpError>error;
    if (request.url === '/coffee-shops') {
      // if this is a validation error
      if (httpError.statusCode === 422) {
        const newError = {
          message: 'My customized validation error message',
          code: 'VALIDATION_FAILED',
          resolution: 'Contact your admin for troubleshooting.',
        };

        // you can change the status code here too
        response.status(422).send(JSON.stringify(newError));
      }
    }
    super.action({request, response}, error);
  }
}
