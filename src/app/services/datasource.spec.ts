import { TestBed } from '@angular/core/testing';

import { Datasource } from './datasource';

describe('Datasource', () => {
  let service: Datasource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Datasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
