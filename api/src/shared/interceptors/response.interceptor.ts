import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types';


@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // If the response is already formatted as ApiResponse, return it as is
                if (data && typeof data === 'object' && data !== null && 'success' in data) {
                    return data;
                }

                // Otherwise, wrap the response in the standard format
                return {
                    success: true,
                    message: 'Request successful',
                    data: data || null,
                    timestamp: new Date().toISOString(),
                };
            }),
        );
    }
}
