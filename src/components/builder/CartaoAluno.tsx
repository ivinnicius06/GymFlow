import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Aluno } from '../../types/treino';

interface CartaoAlunoProps {
  aluno: Aluno;
  selecionado: boolean;
  aoPressionar: () => void;
}

export const CartaoAluno: React.FC<CartaoAlunoProps> = ({
  aluno,
  selecionado,
  aoPressionar,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={aoPressionar}
    >
      <View
        style={[
          styles.avatar,
          { backgroundColor: aluno.corAvatar || '#6B7280' },
        ]}
      >
        <Text style={styles.avatarTexto}>{aluno.iniciais}</Text>
      </View>

      <View style={styles.textoContainer}>
        <Text style={styles.nomeTexto} numberOfLines={1}>
          {aluno.nome}
        </Text>
        <Text style={styles.subtituloTexto} numberOfLines={1}>
          {aluno.treinoAtual || 'Nenhum treino ativo'}
        </Text>
      </View>

      <View
        style={[
          styles.radioExterno,
          selecionado ? styles.radioAtivo : styles.radioInativo,
        ]}
      >
        {selecionado && <View style={styles.radioPonto} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  textoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  nomeTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  subtituloTexto: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  radioExterno: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioAtivo: {
    borderColor: '#16A34A',
  },
  radioInativo: {
    borderColor: '#D1D5DB',
  },
  radioPonto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#16A34A',
  },
});
