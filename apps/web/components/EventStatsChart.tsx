'use client';

import { useQuery } from '@tanstack/react-query';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory';
import { SyncLoader } from 'react-spinners';
import api, { ApiError } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface StatsData {
    totalUsers: number;
    eventParticipants: number;
}

interface EventStatsChartProps {
    eventId: string;
}

export function EventStatsChart({ eventId }: EventStatsChartProps) {
    const { data, isLoading, isError, error } = useQuery<StatsData, ApiError>({
        queryKey: ['eventStats', eventId],
        queryFn: () => api.get(`events/${eventId}/stats`),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <SyncLoader />
            </div>
        );
    }

    if (isError) {
        return <p className="text-destructive">Erro ao carregar estatísticas: {error.message}</p>;
    }

    if (!data) {
        return <p className="text-muted-foreground">Estatísticas não disponíveis.</p>;
    }

    const chartData = [
        { category: 'Total de Usuários', count: data.totalUsers },
        { category: 'Inscritos no Evento', count: data.eventParticipants },
    ];

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[300px]">
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domainPadding={50}
                    >
                        <VictoryAxis
                            style={{ tickLabels: { fontSize: 12, padding: 5 } }}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickFormat={(x) => (`${x}`)}
                        />
                        <VictoryBar
                            data={chartData}
                            x="category"
                            y="count"
                            style={{ data: { fill: '#3b82f6' } }}
                            labels={({ datum }) => `${datum.count}`}
                            labelComponent={<VictoryLabel dy={-20} />}
                            barWidth={50}
                        />
                    </VictoryChart>
                </div>
            </CardContent>
        </Card>
    );
}
