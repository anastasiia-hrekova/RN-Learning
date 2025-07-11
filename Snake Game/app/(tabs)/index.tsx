import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const GAME_WIDTH = Math.min(width - 40, 320);
const GAME_HEIGHT = Math.min(height - 200, 400);
const CELL_SIZE = 12;
const GRID_WIDTH = Math.floor(GAME_WIDTH / CELL_SIZE);
const GRID_HEIGHT = Math.floor(GAME_HEIGHT / CELL_SIZE);

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Position[] = [
  { x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) },
];

const INITIAL_FOOD: Position = {
  x: Math.floor(Math.random() * GRID_WIDTH),
  y: Math.floor(Math.random() * GRID_HEIGHT),
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        setGameOver(true);
        setIsPlaying(false);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        return prevSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        setFood(generateFood());
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood, highScore]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const handleDirectionChange = (newDirection: Direction) => {
    if (!isPlaying) return;
    
    // Prevent reverse direction
    if (
      (direction === 'UP' && newDirection === 'DOWN') ||
      (direction === 'DOWN' && newDirection === 'UP') ||
      (direction === 'LEFT' && newDirection === 'RIGHT') ||
      (direction === 'RIGHT' && newDirection === 'LEFT')
    ) {
      return;
    }

    setDirection(newDirection);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    if (gameOver) {
      resetGame();
      setIsPlaying(true);
    }
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    const isHead = snake[0]?.x === x && snake[0]?.y === y;

    return (
      <View
        key={`${x}-${y}`}
        style={[
          styles.cell,
          isSnake && (isHead ? styles.snakeHead : styles.snakeBody),
          isFood && styles.food,
        ]}
      />
    );
  };

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        grid.push(renderCell(x, y));
      }
    }
    return grid;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Nokia-style header */}
      <View style={styles.header}>
        <Text style={styles.nokiaTitle}>SNAKE</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.scoreText}>High: {highScore}</Text>
        </View>
      </View>

      {/* Game screen */}
      <View style={styles.gameScreen}>
        <View style={styles.gameBoard}>
          {renderGrid()}
        </View>
        
        {gameOver && (
          <View style={styles.gameOverOverlay}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.finalScoreText}>Final Score: {score}</Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('UP')}
          >
            <Text style={styles.controlText}>▲</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('LEFT')}
          >
            <Text style={styles.controlText}>◄</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.centerButton]}
            onPress={gameOver ? startGame : pauseGame}
          >
            <Text style={styles.controlText}>
              {gameOver ? 'START' : isPlaying ? 'PAUSE' : 'PLAY'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('RIGHT')}
          >
            <Text style={styles.controlText}>►</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleDirectionChange('DOWN')}
          >
            <Text style={styles.controlText}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Nokia Classic Snake</Text>
        <TouchableOpacity onPress={resetGame}>
          <Text style={styles.resetText}>Reset Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d3748',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nokiaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9BBC0F',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textShadowColor: '#4a5568',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  scoreContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },
  scoreText: {
    fontSize: 16,
    color: '#9BBC0F',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  gameScreen: {
    backgroundColor: '#8BAC0F',
    borderRadius: 15,
    padding: 8,
    borderWidth: 4,
    borderColor: '#4a5568',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gameBoard: {
    width: GRID_WIDTH * CELL_SIZE,
    height: GRID_HEIGHT * CELL_SIZE,
    backgroundColor: '#9BBC0F',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  snakeHead: {
    backgroundColor: '#0F380F',
    borderRadius: 2,
  },
  snakeBody: {
    backgroundColor: '#306230',
    borderRadius: 1,
  },
  food: {
    backgroundColor: '#0F380F',
    borderRadius: CELL_SIZE / 2,
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 56, 15, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9BBC0F',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
  },
  finalScoreText: {
    fontSize: 16,
    color: '#9BBC0F',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 10,
  },
  controlsContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: '#4a5568',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#9BBC0F',
  },
  centerButton: {
    width: 80,
    height: 60,
    borderRadius: 10,
  },
  controlText: {
    fontSize: 18,
    color: '#9BBC0F',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#718096',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  resetText: {
    fontSize: 14,
    color: '#9BBC0F',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});