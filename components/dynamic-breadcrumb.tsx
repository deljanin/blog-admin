'use client';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  pathNames: string[];
};
export default function DynamicBreadcrumb({ pathNames }: Props) {
  function createBreadcrumbs() {
    return pathNames.map((path, index) => {
      if (index !== pathNames.length - 1) {
        return (
          <>
            <BreadcrumbItem key={index}>
              <BreadcrumbLink asChild>
                <span>{path}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        );
      } else {
        return (
          <BreadcrumbItem key={index}>
            <BreadcrumbPage>
              <span> {path}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        );
      }
    });
  }
  return (
    <Breadcrumb className="cursor-default md:flex">
      <BreadcrumbList>{createBreadcrumbs()}</BreadcrumbList>
    </Breadcrumb>
  );
}
