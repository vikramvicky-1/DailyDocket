"use client";

import React from "react";

const UsersTableSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-4">
        <div className="h-5 bg-gray-600/50 rounded w-48"></div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-4 px-2 w-1/4">
                <div className="h-3 bg-gray-600/50 rounded w-12"></div>
              </th>
              <th className="text-left py-4 px-2 w-1/3">
                <div className="h-3 bg-gray-600/50 rounded w-14"></div>
              </th>
              <th className="text-left py-4 px-2 w-1/4">
                <div className="h-3 bg-gray-600/50 rounded w-10"></div>
              </th>
              <th className="text-center py-4 px-2 w-1/6">
                <div className="h-3 bg-gray-600/50 rounded w-16 mx-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="py-4 px-2">
                  <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
                </td>
                <td className="py-4 px-2">
                  <div className="h-4 bg-gray-600/50 rounded w-5/6"></div>
                </td>
                <td className="py-4 px-2">
                  <div className="h-6 bg-gray-600/50 rounded-full w-20"></div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-8 w-8 bg-gray-600/50 rounded"></div>
                    <div className="h-8 w-8 bg-gray-600/50 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-800/30 border border-gray-600 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-600/50 rounded w-2/3"></div>
                <div className="h-3 bg-gray-600/50 rounded w-4/5"></div>
                <div className="h-5 bg-gray-600/50 rounded-full w-16"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-600/50 rounded"></div>
                <div className="h-8 w-8 bg-gray-600/50 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersTableSkeleton;
