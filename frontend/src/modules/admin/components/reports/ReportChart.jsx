import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#6366f1', '#ec4899', '#a855f7', '#fb923c', '#10b981', '#3b82f6'];

const ReportChart = ({ type = 'bar', data, dataKey, categoryKey = 'name', height = 300, colors = COLORS }) => {

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-100 text-gray-400 text-sm" style={{ height }}>
                No Data Available for Visualization
            </div>
        );
    }

    return (
        <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                {type === 'bar' && (
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        {Array.isArray(dataKey) ? (
                            dataKey.map((key, index) => (
                                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} barSize={30} />
                            ))
                        ) : (
                            <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} barSize={40} />
                        )}
                    </BarChart>
                )}

                {type === 'line' && (
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        {Array.isArray(dataKey) ? (
                            dataKey.map((key, index) => (
                                <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                            ))
                        ) : (
                            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                        )}
                    </LineChart>
                )}

                {type === 'area' && (
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            {Array.isArray(dataKey)
                                ? dataKey.map((key, idx) => (
                                    <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0} />
                                    </linearGradient>
                                ))
                                : <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors[0]} stopOpacity={0.1} />
                                    <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                                </linearGradient>
                            }
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey={categoryKey} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        {Array.isArray(dataKey) ? (
                            dataKey.map((key, index) => (
                                <Area key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} fillOpacity={1} fill={`url(#color${key})`} />
                            ))
                        ) : (
                            <Area type="monotone" dataKey={dataKey} stroke={colors[0]} fillOpacity={1} fill={`url(#color${dataKey})`} />
                        )}
                    </AreaChart>
                )}

                {type === 'pie' && (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey={dataKey} // usually 'value'
                            nameKey={categoryKey} // usually 'name'
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default ReportChart;
