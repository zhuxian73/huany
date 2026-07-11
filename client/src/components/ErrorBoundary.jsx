import { Component } from 'react'

// 全局错误边界，捕获子组件渲染异常
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-dvh bg-bg-primary">
          <div className="text-center max-w-[400px] p-8">
            <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h2 className="text-[18px] font-semibold text-text-primary mb-2">应用出错了</h2>
            <p className="text-[13px] text-text-secondary mb-5">抱歉，发生了一些错误。请尝试重试或刷新页面。</p>
            <button className="px-4 py-2 border-none rounded-lg bg-accent text-white text-[13px] font-medium cursor-pointer transition-colors hover:bg-accent-hover" onClick={this.handleReset}>重试</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
