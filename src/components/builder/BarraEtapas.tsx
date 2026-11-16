import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BarraEtapasProps {
  etapaAtual: 1 | 2 | 3 | 4;
}

interface EtapaInfo {
  numero: 1 | 2 | 3 | 4;
  rotulo: string;
}

const ETAPAS: EtapaInfo[] = [
  { numero: 1, rotulo: 'Aluno' },
  { numero: 2, rotulo: 'Exercícios' },
  { numero: 3, rotulo: 'Detalhes' },
  { numero: 4, rotulo: 'Revisão' },
];

export const BarraEtapas: React.FC<BarraEtapasProps> = ({ etapaAtual }) => {
  return (
    <View style={styles.container}>
      {ETAPAS.map((etapa, index) => {
        const isAtiva = etapa.numero === etapaAtual;
        const isConcluida = etapa.numero < etapaAtual;
        const temConector = index < ETAPAS.length - 1;

        return (
          <React.Fragment key={etapa.numero}>
            <View style={styles.etapaItem}>
              <View
                style={[
                  styles.circulo,
                  isAtiva || isConcluida
                    ? styles.circuloAtivo
                    : styles.circuloInativo,
                ]}
              >
                <Text
                  style={[
                    styles.numeroTexto,
                    isAtiva || isConcluida
                      ? styles.numeroTextoAtivo
                      : styles.numeroTextoInativo,
                  ]}
                >
                  {etapa.numero}
                </Text>
              </View>
              <Text style={styles.rotuloTexto}>{etapa.rotulo}</Text>
            </View>

            {temConector && (
              <View style={styles.conectorContainer}>
                <View
                  style={[
                    styles.conectorLinha,
                    isConcluida && styles.conectorLinhaConcluida,
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: 4,
  },
  etapaItem: {
    alignItems: 'center',
    gap: 4,
  },
  circulo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloAtivo: {
    backgroundColor: '#16A34A',
  },
  circuloInativo: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  numeroTexto: {
    fontSize: 11,
    fontWeight: '600',
  },
  numeroTextoAtivo: {
    color: '#FFFFFF',
  },
  numeroTextoInativo: {
    color: '#6B7280',
  },
  rotuloTexto: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
  },
  conectorContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 11,
  },
  conectorLinha: {
    height: 1,
    backgroundColor: '#D1D5DB',
    width: '100%',
  },
  conectorLinhaConcluida: {
    backgroundColor: '#16A34A',
  },
});
