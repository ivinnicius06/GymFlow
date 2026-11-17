import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { ExercicioConfigurado } from '../../types/treino';

interface FormularioEditarProps {
  item: ExercicioConfigurado;
  aoFechar: () => void;
  aoSalvar: (id: string, novosDados: Partial<ExercicioConfigurado>) => void;
  aoRemover: (id: string) => void;
}

const FormularioEditar: React.FC<FormularioEditarProps> = ({
  item,
  aoFechar,
  aoSalvar,
  aoRemover,
}) => {
  const [series, setSeries] = useState(String(item.series));
  const [repeticoes, setRepeticoes] = useState(item.repeticoes);
  const [cargaKg, setCargaKg] = useState(String(item.cargaKg));
  const [descansoSegundos, setDescansoSegundos] = useState(
    String(item.descansoSegundos),
  );

  const handleSalvar = () => {
    aoSalvar(item.id, {
      series: parseInt(series, 10) || item.series,
      repeticoes: repeticoes.trim() || item.repeticoes,
      cargaKg: parseFloat(cargaKg) || item.cargaKg,
      descansoSegundos: parseInt(descansoSegundos, 10) || item.descansoSegundos,
    });
    aoFechar();
  };

  const handleRemover = () => {
    aoRemover(item.id);
    aoFechar();
  };

  return (
    <View style={styles.conteudo}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{item.nome}</Text>
        <TouchableOpacity onPress={aoFechar} style={styles.fecharBotao}>
          <Feather name="x" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>
        Ajuste os parâmetros deste exercício no treino:
      </Text>

      <View style={styles.campoLinha}>
        <View style={styles.campoItem}>
          <Text style={styles.rotulo}>Séries</Text>
          <TextInput
            style={styles.input}
            value={series}
            onChangeText={setSeries}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.campoItem}>
          <Text style={styles.rotulo}>Repetições</Text>
          <TextInput
            style={styles.input}
            value={repeticoes}
            onChangeText={setRepeticoes}
            placeholder="Ex: 8–12"
          />
        </View>
      </View>

      <View style={styles.campoLinha}>
        <View style={styles.campoItem}>
          <Text style={styles.rotulo}>Carga (kg)</Text>
          <TextInput
            style={styles.input}
            value={cargaKg}
            onChangeText={setCargaKg}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.campoItem}>
          <Text style={styles.rotulo}>Descanso (seg)</Text>
          <TextInput
            style={styles.input}
            value={descansoSegundos}
            onChangeText={setDescansoSegundos}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.botoesContainer}>
        <TouchableOpacity
          style={styles.removerBotao}
          activeOpacity={0.7}
          onPress={handleRemover}
        >
          <Feather name="trash-2" size={16} color="#DC2626" />
          <Text style={styles.removerTexto}>Remover</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.salvarBotao}
          activeOpacity={0.8}
          onPress={handleSalvar}
        >
          <Text style={styles.salvarTexto}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface ModalEditarExercicioProps {
  visivel: boolean;
  item: ExercicioConfigurado | null;
  aoFechar: () => void;
  aoSalvar: (id: string, novosDados: Partial<ExercicioConfigurado>) => void;
  aoRemover: (id: string) => void;
}

export const ModalEditarExercicio: React.FC<ModalEditarExercicioProps> = ({
  visivel,
  item,
  aoFechar,
  aoSalvar,
  aoRemover,
}) => {
  if (!visivel || !item) return null;

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <View style={styles.overlay}>
        <FormularioEditar
          key={item.id}
          item={item}
          aoFechar={aoFechar}
          aoSalvar={aoSalvar}
          aoRemover={aoRemover}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  conteudo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  fecharBotao: {
    padding: 4,
  },
  subtitulo: {
    fontSize: 13,
    color: '#6B7280',
  },
  campoLinha: {
    flexDirection: 'row',
    gap: 12,
  },
  campoItem: {
    flex: 1,
    gap: 4,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  removerBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  removerTexto: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  salvarBotao: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salvarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
